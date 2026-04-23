from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

db_url = settings.DATABASE_URL

# Neon va boshqa cloud DB lar uchun SSL
connect_args = {}
if "neon.tech" in db_url:
    connect_args = {"sslmode": "require"}

engine = create_engine(
    db_url,
    connect_args=connect_args,
    pool_pre_ping=True,
    pool_recycle=300,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
