from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from pwdlib import PasswordHash

from typing import Annotated

from ..core.security import verify_password_hash
from ..schemas.models import User
from .session import get_session


def authenticate_user(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: Annotated[Session, Depends(get_session)]
) -> User:

    credentials_exception = HTTPException(status_code=405, detail='Invalid login credentials.')

    db_user = session.exec(
        select(User).where(User.email == form_data.username)
    ).first()
    if not db_user:
        raise credentials_exception

    if not verify_password_hash(form_data.password, db_user.hashed_password):
        raise credentials_exception
    
    return db_user