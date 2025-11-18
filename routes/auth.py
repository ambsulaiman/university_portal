from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from typing import Annotated

from ..schemas.models import User, Token
from ..dependencies.session import get_session
from ..dependencies.auth import authenticate_user
from ..core.token import create_access_token
from ..utils.config import settings

router = APIRouter(prefix='/auth')


@router.post(
    '/token',
    response_model=Token
)
async def login(
    verified_user: Annotated[User, Depends(authenticate_user)]
):  
    to_encode = {'sub' : verified_user.email}
    token = create_access_token(to_encode, expire_delta=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    return {'access_token' : token, 'token_type' : 'bearer'}