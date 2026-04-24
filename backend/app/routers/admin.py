from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.database import get_db
from app.models.course import Course, Lesson, DifficultyLevel
from app.models.user import User
from app.routers.auth import get_current_user
import re

router = APIRouter()


def require_admin(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin huquqi kerak")
    return current_user


class CourseCreate(BaseModel):
    title: str
    slug: str
    description: str
    short_description: Optional[str] = None
    difficulty: DifficultyLevel = DifficultyLevel.BEGINNER
    duration_hours: float = 0
    is_free: bool = True
    icon: Optional[str] = None
    youtube_url: Optional[str] = None
    color_from: str = "#00C2D4"
    color_to: str = "#00E676"


class LessonCreate(BaseModel):
    title: str
    content: str
    order_index: int = 0
    duration_minutes: int = 10
    xp_reward: int = 50
    youtube_url: Optional[str] = None


def extract_youtube_id(url: str) -> Optional[str]:
    if not url:
        return None
    patterns = [
        r'(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)([^&\n?#]+)',
    ]
    for p in patterns:
        m = re.search(p, url)
        if m:
            return m.group(1)
    return None


# --- COURSES ---
@router.get("/courses")
def list_courses(db: Session = Depends(get_db), _=Depends(require_admin)):
    return db.query(Course).order_by(Course.order_index).all()


@router.post("/courses")
def create_course(data: CourseCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    existing = db.query(Course).filter(Course.slug == data.slug).first()
    if existing:
        raise HTTPException(400, "Bu slug allaqachon mavjud")
    count = db.query(Course).count()
    course = Course(**data.model_dump(), is_published=True, order_index=count + 1)
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@router.put("/courses/{course_id}")
def update_course(course_id: int, data: CourseCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(404, "Kurs topilmadi")
    for k, v in data.model_dump().items():
        setattr(course, k, v)
    db.commit()
    db.refresh(course)
    return course


@router.delete("/courses/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(404, "Kurs topilmadi")
    db.delete(course)
    db.commit()
    return {"message": "Kurs o'chirildi"}


@router.patch("/courses/{course_id}/publish")
def toggle_publish(course_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(404, "Kurs topilmadi")
    course.is_published = not course.is_published
    db.commit()
    return {"is_published": course.is_published}


# --- LESSONS ---
@router.get("/courses/{course_id}/lessons")
def list_lessons(course_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    return db.query(Lesson).filter(Lesson.course_id == course_id).order_by(Lesson.order_index).all()


@router.post("/courses/{course_id}/lessons")
def create_lesson(course_id: int, data: LessonCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    count = db.query(Lesson).filter(Lesson.course_id == course_id).count()
    lesson = Lesson(
        course_id=course_id,
        title=data.title,
        content=data.content,
        order_index=data.order_index or count + 1,
        duration_minutes=data.duration_minutes,
        xp_reward=data.xp_reward,
    )
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson


@router.put("/lessons/{lesson_id}")
def update_lesson(lesson_id: int, data: LessonCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(404, "Dars topilmadi")
    for k, v in data.model_dump().items():
        if hasattr(lesson, k):
            setattr(lesson, k, v)
    db.commit()
    db.refresh(lesson)
    return lesson


@router.delete("/lessons/{lesson_id}")
def delete_lesson(lesson_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(404, "Dars topilmadi")
    db.delete(lesson)
    db.commit()
    return {"message": "Dars o'chirildi"}
