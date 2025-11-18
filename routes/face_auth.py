from fastapi import APIRouter, Depends, HTTPException, Response
from sqlmodel import Session, select
from typing import Annotated
from uuid import UUID

from ..schemas.models import User, FaceEncoding, FaceEncodingOut, Msg
from ..dependencies.session import get_session
from ..core.face_recognition import extract_face_encoding, compare_face_encodings, encoding_to_json
from ..core.token import create_access_token
from ..utils.config import settings
from ..core.logics import get_current_active_user

router = APIRouter(prefix='/faces')


class FaceRegisterRequest:
    def __init__(self, image_data: str):
        self.image_data = image_data


@router.post(
    '/auth/register',
    dependencies=[Depends(get_current_active_user)]
)
async def register_face(
    image_data: str,
    user_id: UUID,
    session: Annotated[Session, Depends(get_session)]
):
    try:
        # Extract face encoding from image
        encoding = extract_face_encoding(image_data)
        
        if encoding is None:
            raise HTTPException(status_code=400, detail="No face detected in image")
        
        # Store encoding in database
        face_encoding = FaceEncoding(
            user_id=user_id,
            encoding=encoding_to_json(encoding)
        )
        
        session.add(face_encoding)
        session.commit()
        session.refresh(face_encoding)
        
        return {
            'msg': 'Face registered successfully',
            'face_id': str(face_encoding.id)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Face registration failed: {str(e)}")


@router.post(
    '/auth/login'
)
async def login_with_face(
    image_data: str,
    response: Response,
    session: Annotated[Session, Depends(get_session)]
):
    try:
        # Extract face encoding from image
        face_encoding = extract_face_encoding(image_data)
        
        if face_encoding is None:
            raise HTTPException(status_code=400, detail="No face detected in image")
        
        # Compare with all stored face encodings
        all_faces = session.exec(select(FaceEncoding)).all()
        
        matched_user = None
        for stored_face in all_faces:
            try:
                if compare_face_encodings(stored_face.encoding, str(face_encoding)):
                    matched_user = stored_face.user
                    break
            except:
                continue
        
        if not matched_user:
            raise HTTPException(status_code=401, detail="Face not recognized")
        
        if matched_user.disabled:
            raise HTTPException(status_code=403, detail="User account is disabled")
        
        # Generate token
        to_encode = {'sub': matched_user.email}
        token = create_access_token(to_encode, expire_delta=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        # Set httpOnly cookie
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
        
        return {
            'access_token': token,
            'token_type': 'bearer',
            'user_email': matched_user.email
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Face authentication failed: {str(e)}")


@router.get(
    '/me',
    response_model=list[FaceEncodingOut],
    dependencies=[Depends(get_current_active_user)]
)
async def get_my_faces(
    user_id: UUID,
    session: Annotated[Session, Depends(get_session)]
):
    faces = session.exec(
        select(FaceEncoding).where(FaceEncoding.user_id == user_id)
    ).all()
    
    return faces


@router.delete(
    '/{face_id}',
    dependencies=[Depends(get_current_active_user)]
)
async def delete_face(
    face_id: UUID,
    session: Annotated[Session, Depends(get_session)]
):
    face = session.get(FaceEncoding, face_id)
    
    if not face:
        raise HTTPException(status_code=404, detail="Face not found")
    
    session.delete(face)
    session.commit()
    
    return {'msg': 'Face deleted successfully'}
