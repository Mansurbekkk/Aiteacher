from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime
from app.database import get_db
from app.models.course import Course, Lesson, Enrollment, LessonProgress
from app.models.user import User
from app.schemas.course import CourseResponse, EnrollmentResponse, LessonProgressCreate, LessonResponse
from app.routers.auth import get_current_user
from app.services.auth_service import calculate_level

router = APIRouter()


@router.get("/", response_model=List[CourseResponse])
def get_courses(db: Session = Depends(get_db)):
    courses = db.query(Course).filter(Course.is_published == True).order_by(Course.order_index).all()
    result = []
    for course in courses:
        lessons_count = db.query(func.count(Lesson.id)).filter(Lesson.course_id == course.id).scalar()
        enrolled_count = db.query(func.count(Enrollment.id)).filter(Enrollment.course_id == course.id).scalar()
        course_dict = CourseResponse.from_orm(course)
        course_dict.lessons_count = lessons_count
        course_dict.enrolled_count = enrolled_count
        result.append(course_dict)
    return result


@router.get("/{slug}", response_model=CourseResponse)
def get_course(slug: str, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.slug == slug, Course.is_published == True).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs topilmadi")
    return course


@router.post("/{course_id}/enroll", response_model=EnrollmentResponse)
def enroll_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs topilmadi")

    existing = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == course_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Allaqachon ro'yxatdan o'tgansiz")

    enrollment = Enrollment(user_id=current_user.id, course_id=course_id)
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment


@router.get("/my/enrollments", response_model=List[EnrollmentResponse])
def get_my_enrollments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    enrollments = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id
    ).all()
    return enrollments


@router.post("/lessons/progress", response_model=dict)
def complete_lesson(
    progress_data: LessonProgressCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lesson = db.query(Lesson).filter(Lesson.id == progress_data.lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Dars topilmadi")

    existing = db.query(LessonProgress).filter(
        LessonProgress.user_id == current_user.id,
        LessonProgress.lesson_id == progress_data.lesson_id
    ).first()

    if existing and existing.completed:
        return {"message": "Allaqachon bajarilgan", "xp_earned": 0}

    if existing:
        existing.completed = True
        existing.quiz_score = progress_data.quiz_score
        existing.completed_at = datetime.utcnow()
    else:
        progress = LessonProgress(
            user_id=current_user.id,
            lesson_id=progress_data.lesson_id,
            completed=True,
            quiz_score=progress_data.quiz_score,
            completed_at=datetime.utcnow()
        )
        db.add(progress)

    # Award XP
    current_user.xp_points += lesson.xp_reward
    current_user.level = calculate_level(current_user.xp_points)

    # Update enrollment progress
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == lesson.course_id
    ).first()

    if enrollment:
        total_lessons = db.query(func.count(Lesson.id)).filter(
            Lesson.course_id == lesson.course_id
        ).scalar()
        completed_lessons = db.query(func.count(LessonProgress.id)).filter(
            LessonProgress.user_id == current_user.id,
            LessonProgress.lesson_id.in_(
                db.query(Lesson.id).filter(Lesson.course_id == lesson.course_id)
            ),
            LessonProgress.completed == True
        ).scalar()
        enrollment.progress_percent = (completed_lessons / total_lessons * 100) if total_lessons > 0 else 0
        if enrollment.progress_percent >= 100:
            enrollment.completed = True
            enrollment.completed_at = datetime.utcnow()

    db.commit()
    return {"message": "Dars bajarildi!", "xp_earned": lesson.xp_reward, "total_xp": current_user.xp_points}
