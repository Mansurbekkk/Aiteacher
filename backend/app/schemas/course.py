from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.course import DifficultyLevel


class LessonBase(BaseModel):
    title: str
    content: str
    order_index: int = 0
    duration_minutes: int = 10
    has_quiz: bool = False
    quiz_data: Optional[str] = None
    xp_reward: int = 50


class LessonCreate(LessonBase):
    course_id: int


class LessonResponse(LessonBase):
    id: int
    course_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class CourseBase(BaseModel):
    title: str
    description: str
    short_description: Optional[str] = None
    difficulty: DifficultyLevel = DifficultyLevel.BEGINNER
    duration_hours: float = 0
    is_free: bool = True
    icon: Optional[str] = None
    youtube_url: Optional[str] = None
    color_from: str = "#00C2D4"
    color_to: str = "#00E676"


class CourseCreate(CourseBase):
    slug: str


class CourseResponse(CourseBase):
    id: int
    slug: str
    is_published: bool
    order_index: int
    thumbnail_url: Optional[str]
    created_at: datetime
    lessons: List[LessonResponse] = []
    lessons_count: Optional[int] = None
    enrolled_count: Optional[int] = None

    class Config:
        from_attributes = True


class EnrollmentResponse(BaseModel):
    id: int
    user_id: int
    course_id: int
    progress_percent: float
    completed: bool
    enrolled_at: datetime
    course: Optional[CourseResponse] = None

    class Config:
        from_attributes = True


class LessonProgressCreate(BaseModel):
    lesson_id: int
    quiz_score: Optional[int] = None


class ChatMessageCreate(BaseModel):
    content: str
    session_id: Optional[int] = None


class ChatSessionResponse(BaseModel):
    id: int
    title: str
    created_at: datetime

    class Config:
        from_attributes = True


class ChatMessageResponse(BaseModel):
    id: int
    session_id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
