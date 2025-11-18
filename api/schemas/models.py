from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional
from uuid import uuid4, UUID

from .enums import UserRoles


####################
## User
####################

class UserBase(SQLModel):
    email: str = Field(index=True, unique=True)
    full_name: str | None = None
    level: str | None = Field(default=None, index=True)
    age: int | None = None
    phone_number: str | None = None
    home_address: str | None = None

    department_id: UUID | None = Field(default=None, foreign_key='department.id')


class User(UserBase, table=True):
    id: UUID | None = Field(default_factory=uuid4, primary_key=True)
    disabled: bool = Field(default=False)
    role: UserRoles = Field(index=True)

    created_at: datetime = Field(default_factory=datetime.utcnow)

    hashed_password: str

    department: Optional['Department'] = Relationship(back_populates='members')

    face_encodings: list['FaceEncoding'] = Relationship(back_populates='user')
    enrollments: list['Enrollment'] = Relationship(back_populates='user')

class UserIn(UserBase):
    password: str

class UserOut(UserBase):
    id: UUID
    role: UserRoles
    enrollments: list['Enrollment'] | None

class UserUpdate(SQLModel):
    model_config = {'extra': 'forbid'}

    full_name: str | None = None
    age: int | None = None
    email: str | None = None
    phone_number: str | None = None
    home_address: str | None = None

    password: str | None = None

class UserAdminUpdate(SQLModel):
    model_config = {'extra': 'forbid'}
    
    disabled: bool | None = None
    role: UserRoles | None = None


####################
## Faculty
####################

class FacultyBase(SQLModel):
    name: str = Field(index=True)
    code: str = Field(index=True)
    description: str | None = None

class Faculty(FacultyBase, table=True):
    id: UUID | None = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    departments: list['Department'] | None = Relationship(back_populates='faculty')

class FacultyIn(FacultyBase):
    pass

class FacultyOut(FacultyBase):
    id: UUID

class FacultyOutWithDepartment(FacultyOut):
    departments: list['Department'] | None = None

class FacultyUpdate(SQLModel):
    name: str | None = None
    code: str
    description: str | None = None


####################
## Department
####################

class DepartmentBase(SQLModel):
    name: str = Field(index=True)
    description: str | None = None
    faculty_id: UUID = Field(foreign_key='faculty.id')

class Department(DepartmentBase, table=True):
    id: UUID | None = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    members: list[User] | None = Relationship(back_populates='department')
    courses: list['Course'] | None = Relationship(back_populates='department')
    
    faculty: Faculty = Relationship(back_populates='departments')

class DepartmentIn(DepartmentBase):
    pass

class DepartmentOut(DepartmentBase):
    id: UUID
    members: list[User] | None = None

class DepartmentUpdate(SQLModel):
    name: str | None = None
    faculty_id: UUID | None = None


####################
## FaceEncoding
####################

class FaceEncoding(SQLModel, table=True):
    id: UUID | None = Field(default_factory=uuid4, primary_key=True)
    
    encoding: str  # JSON array of face encoding vector
    created_at: datetime = Field(default_factory=datetime.utcnow)

    user_id: UUID = Field(foreign_key="user.id", index=True)
    user: User | None = Relationship(back_populates="face_encodings")


class FaceEncodingOut(SQLModel):
    id: UUID
    created_at: datetime


####################
## Course
####################

class CourseBase(SQLModel):
    code: str = Field(index=True, unique=True)
    title: str
    description: str | None = None
    credits: int = Field(default=3)
    level: str = Field(index=True)
    semester: str = Field(index=True)

    department_id: UUID = Field(foreign_key='department.id')


class Course(CourseBase, table=True):
    id: UUID | None = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    department: Department = Relationship(back_populates='courses')

    enrollments: list['Enrollment'] = Relationship(back_populates='course')

class CourseIn(CourseBase):
    pass

class CourseOut(CourseBase):
    id: UUID
    enrollments: list['Enrollment']

class CourseUpdate(SQLModel):
    code: str | None = None
    title: str | None = None
    description: str | None = None
    credits: int | None = Field(None, ge=0)
    level: str | None = None
    semester: str | None = None
    department: str | None = None


####################
## Enrollment
####################

class EnrollmentBase(SQLModel):
    user_id: UUID = Field(foreign_key="user.id")
    course_id: UUID = Field(foreign_key="course.id")

class Enrollment(EnrollmentBase, table=True):
    id: UUID | None = Field(default_factory=uuid4, primary_key=True)
    enrolled_at: datetime = Field(default_factory=datetime.utcnow)

    user: User | None = Relationship(back_populates="enrollments")
    course: Course | None = Relationship(back_populates="enrollments")

class EnrollmentIn(EnrollmentBase):
    pass

class EnrollmentOut(EnrollmentBase):
    id: UUID
    # enrolled_at: datetime
    course: Course | None


######################
## response model
######################

class Msg(SQLModel):
    msg: str

class Token(SQLModel):
    access_token: str
    token_type: str