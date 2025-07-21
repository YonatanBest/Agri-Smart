from fastapi import APIRouter, Query, HTTPException
from src.flows import recommend_fertilizer_flow, recommend_crops_flow

router = APIRouter(prefix="/api/recommend", tags=["Recommendation_Flow"])


@router.get("/crops")
async def recommend_crops(
    lat: float = Query(..., description="Latitude in decimal degrees"),
    lon: float = Query(..., description="Longitude in decimal degrees"),
    depth: str = Query("0-20", description="Soil depth range (e.g., '0-20')"),
    top_k: int = Query(5, description="Number of top probable soil types to retrieve"),
    past_days: int = Query(30, description="Number of past days for weather summary"),
    forecast_days: int = Query(
        0, description="Number of forecast days for weather summary"
    ),
):
    try:
        result = await recommend_crops_flow(
            lat, lon, depth, top_k, past_days, forecast_days
        )
        return {"status": "success", **result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/fertilizer")
async def recommend_fertilizer(
    lat: float = Query(..., description="Latitude in decimal degrees"),
    lon: float = Query(..., description="Longitude in decimal degrees"),
    target_crop: str = Query(..., description="The crop type (eg. maize)"),
    depth: str = Query("0-20", description="Soil depth range (e.g., '0-20')"),
    top_k: int = Query(5, description="Number of top probable soil types to retrieve"),
    past_days: int = Query(30, description="Number of past days for weather summary"),
    forecast_days: int = Query(0, description="Number of forecast days for weather summary"),
):
    try:
        result = await recommend_fertilizer_flow(
            lat, lon, target_crop, depth,top_k, past_days, forecast_days
        )
        return {"status": "success", **result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
