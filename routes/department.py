from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from typing import Annotated
from uuid import UUID

from ..schemas.models import Department, DepartmentIn, DepartmentOut, DepartmentUpdate, Msg
from ..dependencies.session import get_session
from ..core.security import get_password_hash
from ..core.logics import get_current_active_user, authorize_user
from ..schemas.enums import UserRoles

router = APIRouter(
    prefix='/departments',
    dependencies=[Depends(authorize_user(['ADMIN']))]
)


@router.post(
    '/',
    response_model=Msg
)
async def create_new_department(
    department: DepartmentIn,
    session: Annotated[Session, Depends(get_session)]
):
    department_exists = session.exec(
        select(Department).where(Department.name == department.name)
    ).first()
    if department_exists:
        raise HTTPException(status_code=400, detail='Department already registered.')
    
    new_department = Department.model_validate(department)

    session.add(new_department)
    session.commit()

    return {'msg' : 'Created new department successfully.'}


@router.get('/{department_id}',
    response_model=DepartmentOut
)
async def get_department_by_id(
    department_id: UUID,
    session: Annotated[Session, Depends(get_session)]
):
    department = session.get(Department, department_id)
    if not department:
        raise HTTPException(status_code=404, detail='Department not found.')
    
    return department


@router.get(
    '/',
    response_model=list[DepartmentOut]
)
async def get_departments(
    *,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1)] = 100,
    session: Annotated[Session, Depends(get_session)]
):
    departments = session.exec(
        select(Department).offset(skip).limit(limit)
    ).all()
    if not departments:
        raise HTTPException(status_code=404, detail='No department found.')
    
    return departments


@router.patch(
    '/{department_id}',
    response_model=DepartmentOut
)
async def patch_department(
    department_id: UUID,
    department_update: DepartmentUpdate,
    session: Annotated[Session, Depends(get_session)]
):
    department = session.get(Department, department_id)
    if not department:
        raise HTTPException(status_code=404, detail='Department not found.')

    to_update = Department.model_dump(department_update, exclude_unset=True)
    department.sqlmodel_update(to_update)

    session.add(department)
    session.commit()
    session.refresh(department)

    return department


@router.delete(
    '/{department_id}',
    response_model=Msg
)
async def delete_department_by_id(
    department_id: UUID,
    session: Annotated[Session, Depends(get_session)]
):
    department = session.get(Department, department_id)
    if not department:
        raise HTTPException(status_code=404, detail=f'Department not found.')
    
    session.delete(department)
    session.commit()

    return {'msg' : f'Deleted department successfully.'}