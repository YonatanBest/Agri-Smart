import os
from openepi_client.crop_health import CropHealthClient

def predict_crop_health(image_path: str, model_type: str = "binary"):
    with open(image_path, "rb") as f:
        image_data = f.read()

    if model_type == "binary":
        return CropHealthClient.get_binary_prediction(image_data)
    elif model_type == "single":
        return CropHealthClient.get_singleHLT_prediction(image_data)
    elif model_type == "multi":
        return CropHealthClient.get_multiHLT_prediction(image_data)
    else:
        raise ValueError("Invalid model type. Choose 'binary', 'single', or 'multi'")
