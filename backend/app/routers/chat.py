from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.chat import ChatSession, ChatMessage, MessageRole
from app.models.user import User
from app.schemas.course import ChatMessageCreate, ChatSessionResponse, ChatMessageResponse
from app.routers.auth import get_current_user
from app.services.groq_service import chat_with_ai

router = APIRouter()


@router.get("/sessions", response_model=List[ChatSessionResponse])
def get_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sessions = db.query(ChatSession).filter(
        ChatSession.user_id == current_user.id
    ).order_by(ChatSession.updated_at.desc()).limit(20).all()
    return sessions


@router.post("/sessions", response_model=ChatSessionResponse)
def create_session(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = ChatSession(user_id=current_user.id)
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("/sessions/{session_id}/messages", response_model=List[ChatMessageResponse])
def get_messages(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Suhbat topilmadi")
    return session.messages


@router.post("/send", response_model=ChatMessageResponse)
def send_message(
    message_data: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get or create session
    if message_data.session_id:
        session = db.query(ChatSession).filter(
            ChatSession.id == message_data.session_id,
            ChatSession.user_id == current_user.id
        ).first()
        if not session:
            raise HTTPException(status_code=404, detail="Suhbat topilmadi")
    else:
        session = ChatSession(user_id=current_user.id)
        db.add(session)
        db.commit()
        db.refresh(session)

    # Save user message
    user_msg = ChatMessage(
        session_id=session.id,
        role=MessageRole.USER,
        content=message_data.content
    )
    db.add(user_msg)
    db.commit()

    # Get conversation history
    history = [
        {"role": msg.role.value, "content": msg.content}
        for msg in session.messages[-20:]
    ]

    # Get AI response
    ai_response = chat_with_ai(history, message_data.content)

    # Update session title if first message
    if len(session.messages) <= 1:
        session.title = message_data.content[:50] + ("..." if len(message_data.content) > 50 else "")
        db.commit()

    # Save AI response
    ai_msg = ChatMessage(
        session_id=session.id,
        role=MessageRole.ASSISTANT,
        content=ai_response
    )
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)

    return ai_msg


@router.delete("/sessions/{session_id}")
def delete_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Suhbat topilmadi")

    db.query(ChatMessage).filter(ChatMessage.session_id == session_id).delete()
    db.delete(session)
    db.commit()
    return {"message": "Suhbat o'chirildi"}
