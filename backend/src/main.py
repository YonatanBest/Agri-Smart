

from dotenv import load_dotenv
from pathlib import Path
import os

# Load .env from the backend directory
env_path = Path(__file__).resolve().parent / '.env'
load_dotenv(dotenv_path=env_path)

# Setup logging first
from src.logging_config import setup_logging, get_logger

# Configure logging based on environment
log_level = os.getenv("LOG_LEVEL", "INFO")
log_file = os.getenv("LOG_FILE", "logs/app.log")
enable_console = os.getenv("ENABLE_CONSOLE_LOGGING", "true").lower() == "true"
enable_file = os.getenv("ENABLE_FILE_LOGGING", "true").lower() == "true"
enable_json = os.getenv("ENABLE_JSON_LOGGING", "true").lower() == "true"

setup_logging(
    log_level=log_level,
    log_file=log_file,
    enable_console=enable_console,
    enable_file=enable_file,
    enable_json=enable_json
)

logger = get_logger(__name__)

from fastapi import FastAPI, APIRouter
from src.routes.crop_health import router as crop_health_router
from src.routes.soil_data import router as soil_router
from src.routes.weather_forecast import router as weather_router
from src.routes.recommend import router as recommend_router
from src.routes.fertilizer_agent import router as fertilizer_agent_router
from src.routes.chat import router as chat_router
from src.routes.user import router as user_router
from src.routes.monitoring import router as monitoring_router
from src.middleware import LoggingMiddleware, PerformanceMiddleware, ErrorLoggingMiddleware

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Agri-Smart API",
    description="Smart Agriculture Backend API",
    version="1.0.0"
)

# Add logging middleware
app.add_middleware(LoggingMiddleware)
app.add_middleware(PerformanceMiddleware, slow_request_threshold=1.0)
app.add_middleware(ErrorLoggingMiddleware)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(crop_health_router)
app.include_router(soil_router)
app.include_router(weather_router)
app.include_router(recommend_router)
app.include_router(fertilizer_agent_router)
app.include_router(chat_router)
app.include_router(user_router)
app.include_router(monitoring_router)

@app.on_event("startup")
async def startup_event():
    logger.info("Application starting up", extra={"app_name": "Agri-Smart API"})

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Application shutting down", extra={"app_name": "Agri-Smart API"})

@app.get("/health")
async def health_check():
    logger.info("Health check requested")
    return {"status": "healthy", "service": "Agri-Smart API"}
