from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from typing import Annotated
from uuid import UUID

from ..schemas.models import User, UserIn, UserOut, UserUpdate, UserAdminUpdate, Msg
from ..dependencies.session import get_session
from ..core.security import get_password_hash
from ..core.logics import get_current_active_user, authorize_user
from ..schemas.enums import UserRoles

router = APIRouter(
    prefix='/users'
)


@router.post(
    '/',
    response_model=Msg,
    # dependencies=[Depends(authorize_user(['ADMIN', 'STUDENT']))]
)
async def create_new_user(
    user: UserIn,
    session: Annotated[Session, Depends(get_session)]
):
    user_exists = session.exec(
        select(User).where(User.email == user.email)
    ).first()
    if user_exists:
        raise HTTPException(status_code=400, detail='User already registered.')

    hashed_password = get_password_hash(user.password)
    new_user = User.model_validate(user, update={'hashed_password' : hashed_password, 'role' : UserRoles.STUDENT})

    session.add(new_user)
    session.commit()

    return {'msg' : 'Created new user successfully.'}


@router.get(
    '/me',
    response_model=UserOut
)
async def get_user_me(user: Annotated[User, Depends(get_current_active_user)]):
    return user


@router.get('/{user_id}',
    response_model=UserOut,
    dependencies=[Depends(authorize_user(['ADMIN']))]
)
async def get_user_by_id(
    user_id: UUID,
    session: Annotated[Session, Depends(get_session)]
):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found.')
    
    return user


@router.get(
    '/',
    response_model=list[UserOut], 
    dependencies=[Depends(authorize_user(['ADMIN']))]
)
async def get_users(
    *,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1)] = 100,
    session: Annotated[Session, Depends(get_session)]
):
    users = session.exec(
        select(User).offset(skip).limit(limit)
    ).all()
    if not users:
        raise HTTPException(status_code=404, detail='No user found.')
    
    return users


@router.patch(
    '/{user_id}/role',
    response_model=UserOut,
    dependencies=[Depends(authorize_user(['ADMIN']))]
)
async def patch_user_by_admin(
    user_id: UUID,
    user_update: UserAdminUpdate,
    session: Annotated[Session, Depends(get_session)]
):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found.')
        
    to_update = User.model_dump(user_update, exclude_unset=True)
    user.sqlmodel_update(to_update)

    session.add(user)
    session.commit()
    session.refresh(user)

    return user


@router.patch(
    '/{user_id}',
    response_model=UserOut,
    dependencies=[Depends(get_current_active_user)]
)
async def patch_user(
    user_id: UUID,
    user_update: UserUpdate,
    session: Annotated[Session, Depends(get_session)]
):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found.')

    if user_update.password:
        user.hashed_password = get_password_hash(user_update.password)

    to_update = User.model_dump(user_update, exclude_unset=True)
    user.sqlmodel_update(to_update)

    session.add(user)
    session.commit()
    session.refresh(user)

    return user


@router.delete(
    '/{user_id}',
    response_model=Msg,
    dependencies=[Depends(authorize_user(['ADMIN']))]
)
async def delete_user_by_id(
    user_id: UUID,
    session: Annotated[Session, Depends(get_session)]
):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail=f'User not found.')
    
    session.delete(user)
    session.commit()

    return {'msg' : f'Deleted user successfully.'}