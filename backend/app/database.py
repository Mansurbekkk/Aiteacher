from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
from app.config import settings

db_url = settings.DATABASE_URL

# Neon uchun SSL
connect_args = {}
if "neon.tech" in db_url:
    connect_args = {"sslmode": "require"}

# NullPool — Vercel serverless uchun majburiy
engine = create_engine(
    db_url,
    connect_args=connect_args,
    poolclass=NullPool,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
