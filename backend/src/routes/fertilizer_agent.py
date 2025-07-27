from fastapi import APIRouter, Query, HTTPException, Depends
from datetime import datetime
import os
from src.agent_flows.fertilizer_agent_flow import fertilizer_agent_flow
from dotenv import load_dotenv
from src.auth.auth_utils import get_current_user

load_dotenv()  # This will load variables from .env in the same directory

router = APIRouter(prefix="/api/fertilizer", tags=["Fertilizer_Agent"])


@router.post("/agent", dependencies=[Depends(get_current_user)])
async def fertilizer_agent(
    lat: float = Query(..., description="Latitude in decimal degrees"),
    lon: float = Query(..., description="Longitude in decimal degrees"),
    area: float = Query(..., description="Area of farmland in hectares"),
    crop_type: str = Query(
        ..., description="Type of crop planted (e.g., maize, wheat)"
    ),
    dt: str = Query(
        None, description="Current datetime in ISO format (optional, defaults to now)"
    ),
):
    try:
        if dt:
            dt_obj = datetime.fromisoformat(dt)
        else:
            dt_obj = datetime.utcnow()
        gemini_api_key = os.getenv("GOOGLE_API_KEY")

        print("test here", gemini_api_key)
        result = await fertilizer_agent_flow(
            lat=lat,
            lon=lon,
            area=area,
            crop_type=crop_type,
            dt=dt_obj,
            gemini_api_key=gemini_api_key,
        )
        return {"status": "success", **result}
    except Exception as e:
        import traceback

        traceback.print_exc()
        print("Fertilizer agent error:", repr(e))
        raise HTTPException(status_code=500, detail=str(e))
