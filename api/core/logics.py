from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select

from typing import Annotated

from .token import decode_access_token
from ..schemas.models import User
from ..dependencies.session import get_session


oauth2_scheme = OAuth2PasswordBearer(tokenUrl='auth/token')

async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: Annotated[Session, Depends(get_session)
]) -> User:
    payload = decode_access_token(token)
    username = payload['sub']

    user = session.exec(
        select(User).where(User.email == username)
    ).first()
    if not user:
        raise HTTPException(status_code=405, detail='Invalid access token.')

    return user


async def get_current_active_user(
    user: Annotated[User, Depends(get_current_user)]
) -> User:
    if user.disabled:
        raise HTTPException(status_code=405, detail='User is inactive.')

    return user


def authorize_user(
    role_required: list[str]
) -> User:
    def verify_role(
        user: Annotated[User, Depends(get_current_active_user)]
    ) -> User:
        if user.role not in role_required:
            raise HTTPException(status_code=405, detail='User not authorized.')
        return user
    return verify_role