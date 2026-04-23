from pydantic_settings import BaseSettings
import os


def get_database_url() -> str:
    # Neon Vercel integration turli nomlar bilan qo'shadi
    for key in ["DATABASE_URL", "POSTGRES_URL", "POSTGRES_PRISMA_URL", "POSTGRES_URL_NON_POOLING"]:
        val = os.environ.get(key, "")
        if val and "postgres" in val:
            # asyncpg uchun emas, psycopg2 uchun
            return val.replace("postgres://", "postgresql://")
    return "postgresql://postgres:password@localhost:5432/aiteacher"


class Settings(BaseSettings):
    DATABASE_URL: str = get_database_url()
    SECRET_KEY: str = "aiteacher-super-secret-key-2025-mansurbek"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    GROQ_API_KEY: str = ""
    FRONTEND_URL: str = "https://aiteacher-roan.vercel.app"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
