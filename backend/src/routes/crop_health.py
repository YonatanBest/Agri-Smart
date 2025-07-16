from fastapi import APIRouter, UploadFile, File
from src.core.crop_health_api import predict_crop_health
import tempfile

router = APIRouter(prefix="/api/crop-health", tags=["Crop Health"])



@router.post("/predict")
async def analyze_crop_health(image: UploadFile = File(...), model: str = "binary"):
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(await image.read())
        tmp_path = tmp.name

    result = predict_crop_health(tmp_path, model)
    return {"prediction": result}


@router.post("/vgg16-predict")
async def vgg16_predict(image: UploadFile = File(...)):
    import tempfile
    from src.core.vgg16_tflite import predict_vgg16
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(await image.read())
        tmp_path = tmp.name
    result = predict_vgg16(tmp_path)
    return {"prediction": result}


@router.post("/vgg16-keras-predict")
async def vgg16_keras_predict(image: UploadFile = File(...)):
    import tempfile
    from src.core.vgg16_keras import predict_vgg16_keras
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(await image.read())
        tmp_path = tmp.name
    result = predict_vgg16_keras(tmp_path)
    return {"prediction": result}


@router.post("/model-tflite-predict")
async def model_tflite_predict(image: UploadFile = File(...)):
    import tempfile
    from src.core.model_tflite import predict_model_tflite
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(await image.read())
        tmp_path = tmp.name
    result = predict_model_tflite(tmp_path)
    return {"prediction": result}



