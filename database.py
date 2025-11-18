from sqlmodel import SQLModel, create_engine, Session


sqlite_url = 'sqlite:///university.db'
engine = create_engine(sqlite_url, echo=True)

def init_db() -> None:
    SQLModel.metadata.create_all(engine)