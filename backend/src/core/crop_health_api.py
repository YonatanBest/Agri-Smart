import os
from openepi_client.crop_health import CropHealthClient
from kindwise import PlantApi, PlantIdentification, UsageInfo


def predict_crop_health(image_path: str, model_type: str = "multi"):
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


# core/crop_health.py

from kindwise import PlantApi, PlantIdentification, UsageInfo
from typing import Tuple
import os

# Load the API key from environment variable (recommended)
API_KEY = os.getenv("PLANT_ID_API_KEY") or "your_api_key"

# Initialize the PlantApi
api = PlantApi(api_key=API_KEY)


def get_usage_info() -> UsageInfo:
    return api.usage_info()


def identify_plant(image_path: str, location: Tuple[float, float] = None) -> PlantIdentification:
    return api.identify(image_path, latitude_longitude=location)


def get_identification_by_token(token: str) -> PlantIdentification:
    return api.get_identification(token)


def delete_identification(identification: PlantIdentification):
    return api.delete_identification(identification)
