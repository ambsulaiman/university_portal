from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlmodel import Session, select

from typing import Annotated
from uuid import UUID

from ..schemas.models import User, Course, Enrollment, EnrollmentIn, EnrollmentOut, Msg
from ..dependencies.session import get_session
from ..core.security import get_password_hash
from ..core.logics import get_current_active_user, authorize_user
from ..schemas.enums import UserRoles

router = APIRouter(
    prefix='/enrollments'
)


@router.post(
    '/',
    response_model=Msg
)
async def enroll_in_course(
    course_id: Annotated[UUID, Body(embed=True)],
    user: Annotated[User, Depends(authorize_user(['STUDENT']))],
    session: Annotated[Session, Depends(get_session)]
):
    student_already_enrolled = session.exec(
        select(Course).where(Enrollment.course_id == course_id, user.id == Enrollment.user_id)
    ).first()
    if student_already_enrolled:
        raise HTTPException(status_code=400, detail='Student already enrolled in this course.')
    
    new_course = Enrollment(course_id=course_id, user_id=user.id)

    session.add(new_course)
    session.commit()

    return {'msg' : 'Student enrolled successfully.'}


@router.get('/{enrollment_id}',
    response_model=EnrollmentOut,
    dependencies=[Depends(authorize_user(['ADMIN']))]
)
async def get_enrollment_by_id(
    enrollment_id: UUID,
    session: Annotated[Session, Depends(get_session)]
):
    enrollment = session.get(Enrollment, enrollment_id)
    if not enrollment:
        raise HTTPException(status_code=404, detail='Enrollment not found.')
    
    return enrollment


@router.get(
    '/',
    response_model=list[EnrollmentOut], 
    dependencies=[Depends(authorize_user(['ADMIN']))]
)
async def get_enrollment(
    *,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1)] = 100,
    course_id: Annotated[UUID | None, Body(embed=True)] = None,
    session: Annotated[Session, Depends(get_session)]
):
    if course_id:
        enrollments = session.exec(
            select(Enrollment).where(Enrollment.course_id == course_id).offset(skip).limit(limit)
        ).all()
    else:
        enrollments = session.exec(
            select(Enrollment).offset(skip).limit(limit)
        ).all()
        
    if not enrollments:
        raise HTTPException(status_code=404, detail='No enrollment found.')
    
    return enrollments


@router.delete(
    '/{enrollment_id}',
    response_model=Msg
)
async def delete_enrollment_by_id(
    enrollment_id: UUID,
    user: Annotated[User, Depends(authorize_user(['STUDENT', 'ADMIN']))],
    session: Annotated[Session, Depends(get_session)]
):
    if user.role == UserRoles.STUDENT:
        enrollment = session.exec(
            select(Enrollment).where(Enrollment.id == enrollment_id, Enrollment.user_id == user.id)
        ).first()
    else:
        enrollment = session.get(Enrollment, enrollment_id)

    if not enrollment:
        raise HTTPException(status_code=404, detail=f'Enrollment not found.')
    
    session.delete(enrollment)
    session.commit()

    return {'msg' : f'Deleted enrollment successfully.'}