from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from src.services.chat_service import chat_session_manager
from src.services.transalation_service import translation_service
from src.services.llm_service import LLMService

router = APIRouter(prefix="/api/chat", tags=["Chat"])


class StartSessionRequest(BaseModel):
    user_id: Optional[str] = None


class SendMessageRequest(BaseModel):
    session_id: str
    message: str


@router.post("/start-session")
def start_session(req: StartSessionRequest):
    session = chat_session_manager.start_session(user_id=req.user_id)
    return {"session_id": session.session_id, "created_at": session.created_at}


@router.post("/send-message")
async def send_message(req: SendMessageRequest):
    session = chat_session_manager.get_session(req.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Detect language
    user_lang = translation_service.detect_language(req.message)
    message_for_llm = req.message
    needs_translation = user_lang != "en"
    if needs_translation:
        message_for_llm = translation_service.translate_to_english(req.message)

    # Add user message
    chat_session_manager.add_message(
        req.session_id, sender="user", message=message_for_llm
    )

    messages_formatted = "\n".join(
        [f"{m.sender}: {m.message}" for m in session.messages[-10:]]
    )

    print("messages", messages_formatted)

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

    llm = LLMService()
    llm_response = llm.send_message(prompt)
    llm_text = llm_response.get("response", "")

    chat_session_manager.add_message(req.session_id, sender="llm", message=llm_text)
    # Translate LLM response back if needed
    if needs_translation and llm_text:
        llm_text = translation_service.translate_from_english(llm_text, user_lang)

    return {"response": llm_text}


@router.get("/history")
def get_history(session_id: str = Query(...)):
    history = chat_session_manager.get_history(session_id)
    if history is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"messages": [m.dict() for m in history]}
