from fastapi import FastAPI, APIRouter
from src.routes.crop_health import router as crop_health_router
from src.routes.soil_data import router as soil_router
from src.routes.weather_forecast import router as weather_router


app = FastAPI()

app.include_router(crop_health_router)
app.include_router(soil_router)
app.include_router(weather_router)