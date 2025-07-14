from fastapi import APIRouter, HTTPException
from src.core.soil_api import get_soilhive_token, get_soilhive_datasets

router = APIRouter(prefix="/api/soil", tags=["SoilHive"])

@router.get("/datasets")
def list_soil_datasets():
    try:
        token = get_soilhive_token()
        data = get_soilhive_datasets(token)
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
