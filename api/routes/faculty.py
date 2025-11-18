from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from typing import Annotated
from uuid import UUID

from ..schemas.models import (
    Department, Faculty, FacultyIn, FacultyOut,
    FacultyOutWithDepartment, FacultyUpdate, Msg
)

from ..dependencies.session import get_session
from ..core.security import get_password_hash
from ..core.logics import get_current_active_user, authorize_user
from ..schemas.enums import UserRoles

router = APIRouter(
    prefix='/faculties',
    dependencies=[Depends(authorize_user(['ADMIN']))]
)


@router.post(
    '/',
    response_model=Msg
)
async def create_new_faculty(
    faculty: FacultyIn,
    session: Annotated[Session, Depends(get_session)]
):
    faculty_exists = session.exec(
        select(Faculty).where(Faculty.code == faculty.code)
    ).first()
    if faculty_exists:
        raise HTTPException(status_code=400, detail='Faculty already registered.')
    
    new_faculty = Faculty.model_validate(faculty)

    session.add(new_faculty)
    session.commit()

    return {'msg' : 'Created new faculty successfully.'}


@router.get('/{faculty_code}',
    response_model=FacultyOutWithDepartment
)
async def get_faculty_by_id(
    faculty_code: str,
    session: Annotated[Session, Depends(get_session)]
):
    faculty = session.exec(
        select(Faculty).where(Faculty.code == faculty_code)
    ).first()
    if not faculty:
        raise HTTPException(status_code=404, detail='Faculty not found.')
    
    return faculty


@router.get(
    '/',
    response_model=list[FacultyOutWithDepartment]
)
async def get_faculties(
    *,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1)] = 100,
    session: Annotated[Session, Depends(get_session)]
):
    facultys = session.exec(
        select(Faculty).offset(skip).limit(limit)
    ).all()
    if not facultys:
        raise HTTPException(status_code=404, detail='No faculty found.')
    
    return facultys


@router.patch(
    '/{faculty_code}',
    response_model=FacultyOut
)
async def patch_faculty(
    faculty_code: str,
    faculty_update: FacultyUpdate,
    session: Annotated[Session, Depends(get_session)]
):
    faculty = session.exec(
        select(Faculty).where(Faculty.code == faculty_code)
    ).first()
    if not faculty:
        raise HTTPException(status_code=404, detail='Faculty not found.')

    to_update = Faculty.model_dump(faculty_update, exclude_unset=True)
    faculty.sqlmodel_update(to_update)

    session.add(faculty)
    session.commit()
    session.refresh(faculty)

    return faculty


@router.delete(
    '/{faculty_code}',
    response_model=Msg
)
async def delete_faculty_by_id(
    faculty_code: str,
    session: Annotated[Session, Depends(get_session)]
):
    faculty = session.exec(
        select(Faculty).where(Faculty.code == faculty_code)
    ).first()
    if not faculty:
        raise HTTPException(status_code=404, detail=f'Faculty not found.')
    
    session.delete(faculty)
    session.commit()

    return {'msg' : f'Deleted faculty successfully.'}