from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class ChatMessage(BaseModel):
    sender: str  # 'user' or 'llm'
    message: str
    timestamp: datetime


class ChatSession(BaseModel):
    session_id: str
    messages: List[ChatMessage] = []
    created_at: datetime
    updated_at: datetime
    user_id: Optional[str] = None  
