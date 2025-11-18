from enum import Enum

class UserRoles(str, Enum):
    STUDENT = 'STUDENT'
    ADMIN = 'ADMIN'
    LECTURERS = 'LECTURER'