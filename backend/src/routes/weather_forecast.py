from fastapi import APIRouter, Query, HTTPException
from src.ext_apis.weather_api import fetch_weather_forecast

router = APIRouter(prefix="/api/weather", tags=["Weather"])

@router.get("/forecast")
def get_weather_forecast(
    lat: float = Query(..., description="Latitude in decimal degrees"),
    lon: float = Query(..., description="Longitude in decimal degrees"),
    altitude: int = Query(90, description="Altitude in meters (optional)")
):
    try:
        forecast = fetch_weather_forecast(lat, lon, altitude)
        return {"status": "success", "data": forecast}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
