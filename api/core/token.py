from fastapi import HTTPException

import jwt
from jwt.exceptions import InvalidTokenError
from datetime import datetime, timezone, timedelta
from ..utils.config import settings

def create_access_token(data: dict, expire_delta: timedelta | None = None) -> str:
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + (timedelta(expire_delta) or timedelta(minutes=45))

    to_encode.update({'exp': expire})

    return jwt.encode(to_encode, key=settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_access_token(token: str):
    try:
        token_data = jwt.decode(token, key=settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail='Invalid access token.')
    return token_data