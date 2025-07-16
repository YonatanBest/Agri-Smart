from fastapi import APIRouter, UploadFile, File, Form
import tempfile
from flows import diagnosis_flow

router = APIRouter(prefix="/api/crop-health", tags=["Crop Health"])



@router.post("/diagnos")
async def analyze_crop_health(image: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(await image.read())
        tmp_path = tmp.name

    result = diagnosis_flow(tmp_path)
    return result
