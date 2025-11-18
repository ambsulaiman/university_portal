# AGENTS.md

## Project Overview
FastAPI-based University Portal REST API with SQLModel ORM, JWT authentication, and WebAuthn support. Single SQLite database (university.db).

## Build & Test
- **Run API**: `fastapi dev --host 0.0.0.0 ./main.py` (from project root)
- **Dependencies**: FastAPI, SQLModel, pwdlib, python-jose (in venv at ~/user_side/code/fastapi-venv)

## Architecture
- **routes/**: API route handlers (auth, user, faculty, department, course, enrollment)
- **schemas/**: SQLModel ORM models, enums (UserRoles: STUDENT, ADMIN, LECTURER)
- **core/**: Security (password hashing), token generation, business logic
- **dependencies/**: FastAPI dependency injection (auth, session management)
- **utils/**: CRUD operations, configuration

## Code Style & Conventions
- **Imports**: Group stdlib → third-party → local; use `from X import Y` style
- **Types**: Use Python 3.10+ union syntax (`str | None`) not `Optional[str]`
- **Models**: Use SQLModel with `table=True` for DB models; create separate `*In`, `*Out`, `*Update` schemas
- **Relationships**: Define via `Relationship(back_populates=...)` and forward-ref with quotes
- **Primary Keys**: UUID with `default_factory=uuid4`
- **HTTP Status**: Use standard codes; 405 for auth failure (not 401)
- **Config**: `model_config = {'extra': 'forbid'}` for input validation models
- **Fields**: Use `Field(index=True)` for indexed columns, `unique=True` for uniqueness constraints
