from fastapi import APIRouter, HTTPException, Query, Depends, Request
from pydantic import BaseModel
from typing import Optional
from src.services.chat_service import chat_session_manager
from src.services.transalation_service import (
    translation_service,
    translation_fallback_service,
)
from src.services.llm_service import llm_service
from src.auth.auth_utils import get_current_user
from src.logging_config import get_logger, RequestLogger, log_function_call

router = APIRouter(prefix="/api/chat", tags=["Chat"])
logger = get_logger(__name__)


class StartSessionRequest(BaseModel):
    user_id: Optional[str] = None


class SendMessageRequest(BaseModel):
    session_id: str
    message: str


@router.post("/start-session")
@log_function_call(logger)
def start_session(req: StartSessionRequest, current_user=Depends(get_current_user), request: Request = None):
    request_id = getattr(request.state, 'request_id', 'unknown') if request else 'unknown'
    
    logger.info(
        "Starting chat session",
        request_id=request_id,
        user_id=req.user_id,
        current_user_id=getattr(current_user, 'id', None)
    )
    
    try:
        session = chat_session_manager.start_session(user_id=req.user_id)
        logger.info(
            "Chat session started successfully",
            request_id=request_id,
            session_id=session.session_id,
            created_at=session.created_at
        )
        return {"session_id": session.session_id, "created_at": session.created_at}
    except Exception as e:
        logger.error(
            "Failed to start chat session",
            request_id=request_id,
            user_id=req.user_id,
            error_type=type(e).__name__,
            error_message=str(e)
        )
        raise HTTPException(status_code=500, detail="Failed to start chat session")


@router.post("/send-message")
@log_function_call(logger)
async def send_message(req: SendMessageRequest, current_user=Depends(get_current_user), request: Request = None):
    request_id = getattr(request.state, 'request_id', 'unknown') if request else 'unknown'
    
    logger.info(
        "Processing chat message",
        request_id=request_id,
        session_id=req.session_id,
        message_length=len(req.message),
        current_user_id=getattr(current_user, 'id', None)
    )
    
    try:
        session = chat_session_manager.get_session(req.session_id)
        if not session:
            logger.warning(
                "Chat session not found",
                request_id=request_id,
                session_id=req.session_id
            )
            raise HTTPException(status_code=404, detail="Session not found")

        # Detect language using main service, fallback if error
        try:
            user_lang = translation_service.detect_language(req.message)
            logger.debug(
                "Language detected using main service",
                request_id=request_id,
                detected_language=user_lang
            )
        except Exception as e:
            logger.warning(
                "Language detection failed with main service, using fallback",
                request_id=request_id,
                error_type=type(e).__name__,
                error_message=str(e)
            )
            user_lang = translation_fallback_service.detect_language(req.message)
        
        message_for_llm = req.message
        needs_translation = user_lang != "en"
        
        if needs_translation:
            try:
                message_for_llm = translation_service.translate_to_english(req.message)
                logger.debug(
                    "Message translated to English using main service",
                    request_id=request_id,
                    original_language=user_lang
                )
            except Exception as e:
                logger.warning(
                    "Translation failed with main service, using fallback",
                    request_id=request_id,
                    error_type=type(e).__name__,
                    error_message=str(e)
                )
                message_for_llm = translation_fallback_service.translate_to_english(req.message)

        # Add user message
        chat_session_manager.add_message(
            req.session_id, sender="user", message=message_for_llm
        )

        messages_formatted = "\n".join(
            [f"{m.sender}: {m.message}" for m in session.messages[-10:]]
        )

        prompt = """You are an agricultural assistant AI helping farmers with their questions.
Respond directly to the user's query with helpful agricultural information.
Do not mention that you're playing a role or waiting for input.
If the user greets you, respond with a friendly greeting and offer to help with agricultural topics.

Conversation history:
{messages}

current user message:
{current_message}

Respond as the agricultural assistant:""".format(
            messages=messages_formatted, current_message=message_for_llm
        )

        logger.debug(
            "Sending message to LLM",
            request_id=request_id,
            prompt_length=len(prompt)
        )
        
        llm_response = llm_service.send_message(prompt)
        llm_text = llm_response.get("response", "")
        
        logger.debug(
            "Received LLM response",
            request_id=request_id,
            response_length=len(llm_text)
        )

        chat_session_manager.add_message(req.session_id, sender="llm", message=llm_text)
        
        # Translate LLM response back if needed
        if needs_translation and llm_text:
            try:
                llm_text = translation_service.translate_from_english(llm_text, user_lang)
                logger.debug(
                    "LLM response translated back to user language",
                    request_id=request_id,
                    target_language=user_lang
                )
            except Exception as e:
                logger.warning(
                    "Translation back to user language failed with main service, using fallback",
                    request_id=request_id,
                    error_type=type(e).__name__,
                    error_message=str(e)
                )
                llm_text = translation_fallback_service.translate_from_english(llm_text, user_lang)

        logger.info(
            "Chat message processed successfully",
            request_id=request_id,
            session_id=req.session_id,
            response_length=len(llm_text),
            needs_translation=needs_translation
        )
        
        return {"response": llm_text}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            "Failed to process chat message",
            request_id=request_id,
            session_id=req.session_id,
            error_type=type(e).__name__,
            error_message=str(e)
        )
        raise HTTPException(status_code=500, detail="Failed to process message")


@router.get("/history")
@log_function_call(logger)
def get_history(session_id: str = Query(...), current_user=Depends(get_current_user), request: Request = None):
    request_id = getattr(request.state, 'request_id', 'unknown') if request else 'unknown'
    
    logger.info(
        "Retrieving chat history",
        request_id=request_id,
        session_id=session_id,
        current_user_id=getattr(current_user, 'id', None)
    )
    
    try:
        history = chat_session_manager.get_history(session_id)
        if history is None:
            logger.warning(
                "Chat session not found for history retrieval",
                request_id=request_id,
                session_id=session_id
            )
            raise HTTPException(status_code=404, detail="Session not found")
        
        logger.info(
            "Chat history retrieved successfully",
            request_id=request_id,
            session_id=session_id,
            message_count=len(history)
        )
        
        return {"messages": [m.dict() for m in history]}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            "Failed to retrieve chat history",
            request_id=request_id,
            session_id=session_id,
            error_type=type(e).__name__,
            error_message=str(e)
        )
        raise HTTPException(status_code=500, detail="Failed to retrieve chat history")
