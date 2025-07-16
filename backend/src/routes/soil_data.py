# routes/soil.py
from fastapi import APIRouter, Query
from src.ext_apis.soil_api import get_soil_data

router = APIRouter()

@router.get("/soil-info")
def soil_info(lat: float = Query(...), lon: float = Query(...)):
    try:
        nitrogen = get_soil_data(lat, lon)
        return {
            "latitude": lat,
            "longitude": lon,
            "soil_property": "nitrogen_0-5cm_Q0.5",
            "value": nitrogen
        }
    except Exception as e:
        return {"error": str(e)}
