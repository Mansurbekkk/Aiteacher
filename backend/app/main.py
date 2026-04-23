from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models import user, course, chat  # noqa: F401
from app.routers import auth, courses, chat as chat_router, users
# DB jadvallarini yaratish — xato bo'lsa ham davom etsin
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"DB create_all xatosi: {e}")

app = FastAPI(
    title="AITeacher Platform",
    description="Sun'iy intellektni o'rganish uchun platforma",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(courses.router, prefix="/api/courses", tags=["Courses"])
app.include_router(chat_router.router, prefix="/api/chat", tags=["AI Chat"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])


@app.get("/")
def root():
    return {"name": "AITeacher Platform API", "version": "1.0.0", "status": "running"}


@app.get("/health")
def health():
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "healthy", "db": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "db": str(e)}
