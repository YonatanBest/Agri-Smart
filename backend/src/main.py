from fastapi import FastAPI, APIRouter
from src.routes.crop_health import router as crop_health_router
from src.routes.soil_data import router as soil_router
from src.routes.weather_forecast import router as weather_router
from src.routes.recommend import router as recommend_router
from src.routes.fertilizer_agent import router as fertilizer_agent_router
from src.routes.chat import router as chat_router

from dotenv import load_dotenv

load_dotenv()


app = FastAPI()

app.include_router(crop_health_router)
app.include_router(soil_router)
app.include_router(weather_router)
app.include_router(recommend_router)
app.include_router(fertilizer_agent_router)
app.include_router(chat_router)
