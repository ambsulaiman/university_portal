import base64
import json
from io import BytesIO
from PIL import Image
import numpy as np

try:
    import face_recognition
    FACE_RECOGNITION_AVAILABLE = True
except ImportError:
    FACE_RECOGNITION_AVAILABLE = False


def decode_image(image_data: str) -> Image.Image:
    try:
        # Remove data URL prefix if present
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        image = Image.open(BytesIO(image_bytes))
        return image
    except Exception as e:
        raise ValueError(f"Failed to decode image: {str(e)}")


def extract_face_encoding(image_data: str) -> list | None:
    if not FACE_RECOGNITION_AVAILABLE:
        raise RuntimeError("face_recognition library not installed")
    
    try:
        image = decode_image(image_data)
        image_np = np.array(image)
        
        # Find faces in image
        face_locations = face_recognition.face_locations(image_np)
        
        if not face_locations:
            return None
        
        # Get encoding of the first face found
        face_encodings = face_recognition.face_encodings(image_np, face_locations)
        
        if not face_encodings:
            return None
        
        # Return first face encoding as list
        return face_encodings[0].tolist()
    except Exception as e:
        raise ValueError(f"Failed to extract face encoding: {str(e)}")


def compare_face_encodings(encoding1: str, encoding2: str, tolerance: float = 0.6) -> bool:
    if not FACE_RECOGNITION_AVAILABLE:
        raise RuntimeError("face_recognition library not installed")
    
    try:
        enc1 = np.array(json.loads(encoding1))
        enc2 = np.array(json.loads(encoding2))
        
        distance = face_recognition.face_distance([enc1], enc2)[0]
        
        return distance < tolerance
    except Exception as e:
        raise ValueError(f"Failed to compare encodings: {str(e)}")


def encoding_to_json(encoding: list) -> str:
    return json.dumps(encoding)


def json_to_encoding(json_str: str) -> list:
    return json.loads(json_str)
