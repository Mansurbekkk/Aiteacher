from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.user import User
from app.models.course import Enrollment, LessonProgress
from app.schemas.user import UserResponse, UserUpdate
from app.routers.auth import get_current_user

router = APIRouter()


@router.get("/me/stats")
def get_my_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    enrollments_count = db.query(func.count(Enrollment.id)).filter(
        Enrollment.user_id == current_user.id
    ).scalar()
    completed_courses = db.query(func.count(Enrollment.id)).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.completed == True
    ).scalar()
    completed_lessons = db.query(func.count(LessonProgress.id)).filter(
        LessonProgress.user_id == current_user.id,
        LessonProgress.completed == True
    ).scalar()

    return {
        "user": current_user,
        "enrollments_count": enrollments_count,
        "completed_courses": completed_courses,
        "completed_lessons": completed_lessons,
        "xp_points": current_user.xp_points,
        "level": current_user.level,
        "next_level_xp": get_next_level_xp(current_user.level)
    }


def get_next_level_xp(level: int) -> int:
    thresholds = [0, 500, 1500, 3000, 6000, 10000, 15000, 25000, 40000, 60000, 100000]
    if level < len(thresholds) - 1:
        return thresholds[level]
    return thresholds[-1]


@router.put("/me", response_model=UserResponse)
def update_profile(
    update_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if update_data.full_name:
        current_user.full_name = update_data.full_name
    if update_data.bio is not None:
        current_user.bio = update_data.bio
    if update_data.avatar_url is not None:
        current_user.avatar_url = update_data.avatar_url

    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    users = db.query(User).filter(User.is_active == True).order_by(
        User.xp_points.desc()
    ).limit(10).all()
    return [
        {
            "rank": i + 1,
            "username": u.username,
            "full_name": u.full_name,
            "xp_points": u.xp_points,
            "level": u.level,
            "avatar_url": u.avatar_url
        }
        for i, u in enumerate(users)
    ]
