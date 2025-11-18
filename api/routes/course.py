from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from typing import Annotated
from uuid import UUID

from ..schemas.models import Course, CourseIn, CourseOut, CourseUpdate, Msg
from ..dependencies.session import get_session
from ..core.security import get_password_hash
from ..core.logics import get_current_active_user, authorize_user
from ..schemas.enums import UserRoles

router = APIRouter(
    prefix='/courses'
)


@router.post(
    '/',
    response_model=Msg,
    dependencies=[Depends(authorize_user(['ADMIN']))]
)
async def create_new_course(
    course: CourseIn,
    session: Annotated[Session, Depends(get_session)]
):
    course_exists = session.exec(
        select(Course).where(Course.code == course.code)
    ).first()
    if course_exists:
        raise HTTPException(status_code=400, detail='Course already registered.')
    
    new_course = Course.model_validate(course)

    session.add(new_course)
    session.commit()

    return {'msg' : 'Created new course successfully.'}


@router.get('/{course_id}',
    response_model=CourseOut,
    dependencies=[Depends(authorize_user(['ADMIN']))]
)
async def get_course_by_id(
    course_id: UUID,
    session: Annotated[Session, Depends(get_session)]
):
    course = session.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail='Course not found.')
    
    return course


@router.get(
    '/',
    response_model=list[CourseOut], 
    dependencies=[Depends(authorize_user(['ADMIN']))]
)
async def get_courses(
    *,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1)] = 100,
    session: Annotated[Session, Depends(get_session)]
):
    courses = session.exec(
        select(Course).offset(skip).limit(limit)
    ).all()
    if not courses:
        raise HTTPException(status_code=404, detail='No course found.')
    
    return courses


@router.patch(
    '/{course_id}',
    response_model=CourseOut,
    dependencies=[Depends(get_current_active_user)]
)
async def patch_course(
    course_id: UUID,
    course_update: CourseUpdate,
    session: Annotated[Session, Depends(get_session)]
):
    course = session.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail='Course not found.')

    to_update = Course.model_dump(course_update, exclude_unset=True)
    course.sqlmodel_update(to_update)

    session.add(course)
    session.commit()
    session.refresh(course)

    return course


@router.delete(
    '/{course_id}',
    response_model=Msg,
    dependencies=[Depends(authorize_user(['ADMIN']))]
)
async def delete_course_by_id(
    course_id: UUID,
    session: Annotated[Session, Depends(get_session)]
):
    course = session.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail=f'Course not found.')
    
    session.delete(course)
    session.commit()

    return {'msg' : f'Deleted course successfully.'}