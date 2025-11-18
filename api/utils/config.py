from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///university" # "postgresql://postgres:postgres@:127.0.0.1:5432/university"
    SECRET_KEY: str = "8126190dca5f2bd0f5dc11d97e8ffea6e106e10b3a6af0e1e3232a5ece9d6c42"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    ALGORITHM: str = 'HS256'

settings = Settings()
