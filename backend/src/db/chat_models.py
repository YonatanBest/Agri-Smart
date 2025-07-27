from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Integer
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

Base = declarative_base()


class ChatSessionDB(Base):
    __tablename__ = "chat_sessions"
    session_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = Column(String, nullable=True)
    messages = relationship(
        "ChatMessageDB", back_populates="session", cascade="all, delete-orphan"
    )


class ChatMessageDB(Base):
    __tablename__ = "chat_messages"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String, ForeignKey("chat_sessions.session_id"))
    sender = Column(String)
    message = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    session = relationship("ChatSessionDB", back_populates="messages")


class User(Base):
    __tablename__ = "users"
    user_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String)
    email = Column(String, unique=True)
    location = Column(String)
    preferred_language = Column(String)
    crops_grown = Column(String)
    user_type = Column(String)  # aspiring, beginner, experienced, explorer
    years_experience = Column(Integer, nullable=True)
    main_goal = Column(String, nullable=True)
    password_hash = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
