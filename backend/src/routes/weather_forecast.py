from fastapi import APIRouter, Query, HTTPException, Depends
from src.ext_apis.weather_api import fetch_weather_summary, simplify_weather_response
from src.auth.auth_utils import get_current_user

router = APIRouter(prefix="/api/weather", tags=["Weather"])


@router.get("/forecast")
async def get_weather_forecast(
    lat: float = Query(..., description="Latitude in decimal degrees"),
    lon: float = Query(..., description="Longitude in decimal degrees"),
    altitude: int = Query(90, description="Altitude in meters (optional)"),
    months: int = Query(4, ge=1, le=12, description="Number of months to forecast"),
    current_user=Depends(get_current_user),
):
    try:
        result = await fetch_weather_summary(lat, lon, altitude, months)
        return result
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
