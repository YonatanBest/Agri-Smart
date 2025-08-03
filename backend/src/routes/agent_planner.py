from fastapi import APIRouter, Depends
from src.auth.auth_utils import get_current_user


router = APIRouter(prefix="/api/agent_planner", tags=["Agent Planner"])

def weekly_planner(user_id: str, current_user=Depends(get_current_user)):
    pass



