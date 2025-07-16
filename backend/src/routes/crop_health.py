from fastapi import APIRouter, UploadFile, File, Form
from src.ext_apis.crop_health_api import predict_crop_health
import tempfile

router = APIRouter(prefix="/api/crop-health", tags=["Crop Health"])



@router.post("/predict")
async def analyze_crop_health(image: UploadFile = File(...), model: str = "binary"):
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(await image.read())
        tmp_path = tmp.name

    result = predict_crop_health(tmp_path, model)
    return result
