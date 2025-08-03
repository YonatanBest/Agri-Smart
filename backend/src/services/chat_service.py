import uuid
from datetime import datetime
from typing import Dict, Optional, List
from src.models.chat import ChatSession, ChatMessage
from sqlalchemy.orm import Session
from src.db import SessionLocal
from src.db.chat_models import ChatSessionDB, ChatMessageDB
from src.logging_config import get_logger, log_function_call

logger = get_logger(__name__)


class ChatSessionManager:
    @log_function_call(logger)
    def start_session(self, user_id: Optional[str] = None) -> ChatSession:
        logger.info("Creating new chat session", user_id=user_id)
        
        try:
            db: Session = SessionLocal()
            session_id = str(uuid.uuid4())
            now = datetime.utcnow()
            
            db_session = ChatSessionDB(
                session_id=session_id, created_at=now, updated_at=now, user_id=user_id
            )
            db.add(db_session)
            db.commit()
            db.refresh(db_session)
            db.close()
            
            logger.info(
                "Chat session created successfully",
                session_id=session_id,
                user_id=user_id,
                created_at=now.isoformat()
            )
            
            return ChatSession(
                session_id=session_id,
                messages=[],
                created_at=now,
                updated_at=now,
                user_id=user_id,
            )
        except Exception as e:
            logger.error(
                "Failed to create chat session",
                user_id=user_id,
                error_type=type(e).__name__,
                error_message=str(e)
            )
            raise

    @log_function_call(logger)
    def get_session(self, session_id: str) -> Optional[ChatSession]:
        logger.debug("Retrieving chat session", session_id=session_id)
        
        try:
            db: Session = SessionLocal()
            db_session = db.query(ChatSessionDB).filter_by(session_id=session_id).first()
            
            if not db_session:
                logger.warning("Chat session not found", session_id=session_id)
                db.close()
                return None
            
            messages = [
                ChatMessage(sender=m.sender, message=m.message, timestamp=m.timestamp)
                for m in db_session.messages
            ]
            
            session = ChatSession(
                session_id=db_session.session_id,
                messages=messages,
                created_at=db_session.created_at,
                updated_at=db_session.updated_at,
                user_id=db_session.user_id,
            )
            
            db.close()
            
            logger.debug(
                "Chat session retrieved successfully",
                session_id=session_id,
                message_count=len(messages),
                user_id=db_session.user_id
            )
            
            return session
        except Exception as e:
            logger.error(
                "Failed to retrieve chat session",
                session_id=session_id,
                error_type=type(e).__name__,
                error_message=str(e)
            )
            raise

    @log_function_call(logger)
    def add_message(
        self, session_id: str, sender: str, message: str
    ) -> Optional[ChatSession]:
        logger.debug(
            "Adding message to chat session",
            session_id=session_id,
            sender=sender,
            message_length=len(message)
        )
        
        try:
            db: Session = SessionLocal()
            db_session = db.query(ChatSessionDB).filter_by(session_id=session_id).first()
            
            if not db_session:
                logger.warning("Chat session not found for message addition", session_id=session_id)
                db.close()
                return None
            
            msg = ChatMessageDB(
                id=str(uuid.uuid4()),
                session_id=session_id,
                sender=sender,
                message=message,
                timestamp=datetime.utcnow(),
            )
            
            db_session.messages.append(msg)
            db_session.updated_at = datetime.utcnow()
            db.add(msg)
            db.commit()
            db.refresh(db_session)
            
            messages = [
                ChatMessage(sender=m.sender, message=m.message, timestamp=m.timestamp)
                for m in db_session.messages
            ]
            
            session = ChatSession(
                session_id=db_session.session_id,
                messages=messages,
                created_at=db_session.created_at,
                updated_at=db_session.updated_at,
                user_id=db_session.user_id,
            )
            
            db.close()
            
            logger.debug(
                "Message added successfully",
                session_id=session_id,
                sender=sender,
                total_messages=len(messages)
            )
            
            return session
        except Exception as e:
            logger.error(
                "Failed to add message to chat session",
                session_id=session_id,
                sender=sender,
                error_type=type(e).__name__,
                error_message=str(e)
            )
            raise

    @log_function_call(logger)
    def get_history(self, session_id: str) -> Optional[List[ChatMessage]]:
        logger.debug("Retrieving chat history", session_id=session_id)
        
        try:
            db: Session = SessionLocal()
            db_session = db.query(ChatSessionDB).filter_by(session_id=session_id).first()
            
            if not db_session:
                logger.warning("Chat session not found for history retrieval", session_id=session_id)
                db.close()
                return None
            
            messages = [
                ChatMessage(sender=m.sender, message=m.message, timestamp=m.timestamp)
                for m in db_session.messages
            ]
            
            db.close()
            
            logger.debug(
                "Chat history retrieved successfully",
                session_id=session_id,
                message_count=len(messages)
            )
            
            return messages
        except Exception as e:
            logger.error(
                "Failed to retrieve chat history",
                session_id=session_id,
                error_type=type(e).__name__,
                error_message=str(e)
            )
            raise


chat_session_manager = ChatSessionManager()


