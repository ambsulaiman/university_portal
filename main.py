from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db
from .routes import auth, user, faculty, department, course, enrollment, face_auth
from .schemas.models import User, Course, Enrollment



app = FastAPI(
    description='University Portal API.'
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event('startup')
async def on_startup():
    init_db()

@app.get('/')
async def index():
    return {'msg': 'University Portal API.'}


app.include_router(auth.router)
app.include_router(face_auth.router)
app.include_router(user.router)
app.include_router(course.router)
app.include_router(faculty.router)
app.include_router(department.router)
app.include_router(enrollment.router)