from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Integer
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.dialects.postgresql import UUID
from .base import Base
import uuid
from datetime import datetime




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