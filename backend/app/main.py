from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.database import engine, Base
from app.models import user, course, chat  # noqa: F401
from app.routers import auth, courses, chat as chat_router, users

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

# Global xato handler — debug uchun
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc), "type": type(exc).__name__}
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


@app.post("/api/setup")
def setup_db():
    """Jadvallarni yaratish — bir marta ishlatiladi"""
    try:
        Base.metadata.create_all(bind=engine)
        return {"status": "ok", "message": "Jadvallar yaratildi"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
