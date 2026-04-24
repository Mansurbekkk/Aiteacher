from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.database import engine, Base
from app.models import user, course, chat  # noqa: F401
from app.routers import auth, courses, chat as chat_router, users, admin

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
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])


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
    """Jadvallarni yaratish va admin foydalanuvchi qo'shish"""
    try:
        Base.metadata.create_all(bind=engine)

        # Admin foydalanuvchi yaratish
        from app.database import SessionLocal
        from app.models.user import User
        from app.services.auth_service import get_password_hash
        db = SessionLocal()
        try:
            existing = db.query(User).filter(User.email == "admin@aiteacher.uz").first()
            if not existing:
                admin_user = User(
                    username="admin",
                    email="admin@aiteacher.uz",
                    hashed_password=get_password_hash("admin123"),
                    full_name="Admin",
                    is_admin=True,
                    is_active=True,
                )
                db.add(admin_user)
                db.commit()
                admin_created = True
            else:
                # Mavjud bo'lsa is_admin=True qilish
                existing.is_admin = True
                db.commit()
                admin_created = False
        finally:
            db.close()

        return {
            "status": "ok",
            "message": "Jadvallar yaratildi",
            "admin_created": admin_created
        }
    except Exception as e:
        return {"status": "error", "detail": str(e)}
