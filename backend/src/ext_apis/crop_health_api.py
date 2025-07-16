import requests
from openepi_client.crop_health import CropHealthClient
from dotenv import load_dotenv
import os

load_dotenv()
def simplify_prediction_result(prediction):
    kindwise = prediction.get("kindwise_result", {})
    openepi_raw = prediction.get("openEPI_result", {})

    openepi = {
        "healthy": openepi_raw.get("HLT", 0),
        "not_healthy": openepi_raw.get("NOT_HLT", 0)
    }

    diseases = []
    for suggestion in kindwise.get("result", {}).get("disease", {}).get("suggestions", []):
        if suggestion["probability"] > 0.2:
            similar_images = [
                {
                    "url": img["url"],
                    "citation": img.get("citation", "")
                }
                for img in suggestion.get("similar_images", [])
            ]
            diseases.append({
                "name": suggestion["name"],
                "probability": suggestion["probability"],
                "scientific_name": suggestion["scientific_name"],
                "similar_images": similar_images
            })

    crops = []
    for crop in kindwise.get("result", {}).get("crop", {}).get("suggestions", []):
        similar_images = [
            {
                "url": img["url"],
                "citation": img.get("citation", "")
            }
            for img in crop.get("similar_images", [])
        ]
        crops.append({
            "name": crop["name"],
            "probability": crop["probability"],
            "scientific_name": crop["scientific_name"],
            "similar_images": similar_images
        })

    is_plant = kindwise.get("result", {}).get("is_plant", {}).get("binary", False)

    return {
        "kindwise": {
            "is_plant": is_plant,
            "diseases": diseases,
            "crops": crops
        },
        "openepi": openepi
    }


def openEPI_api(image_data: object, model_type: str = "multi")-> dict:
    openEPI_result = {}

    if model_type == "binary":
        openEPI_result = dict(CropHealthClient.get_binary_prediction(image_data))
    elif model_type == "single":
        openEPI_result = dict(CropHealthClient.get_singleHLT_prediction(image_data))
    elif model_type == "multi":
        openEPI_result = dict(CropHealthClient.get_multiHLT_prediction(image_data))
    else:
        raise ValueError("Invalid model type. Choose 'binary', 'single', or 'multi' for the openEPI api")
    
    return openEPI_result

def kindwise_api(image_path: str, image_data: object, latitude: str = 49.5, longitude: str = 45, similar_images: bool = True):
    URL = os.getenv("KINDWISE_URL")


    headers = {
        "Api-Key": os.getenv("KINDWISE_API_KEY")
    }
    

    form_data = {
        "latitude": latitude,
        "longitude": longitude,
        "similar_images": str(similar_images).lower() 

    }

    files = {
        "images": (image_path, image_data, "image/jpeg")
    }

    try:
        kindwise_res = requests.post(URL, headers=headers, data=form_data, files=files)
        kindwise_res.raise_for_status()
        kindwise_result = kindwise_res.json()
    except requests.exceptions.RequestException as e:
        print(f"HTTP error occurred: {e}")
        kindwise_result = {"error": str(e)}
    except Exception as e:
        print(f"Unknown Error occurred: {e}")
        kindwise_result = {"error": str(e)}

    return kindwise_result


def predict_crop_health(image_path: str, model_type: str = "multi", latitude: str = 49.5, longitude: str = 45, similar_images: bool = True)-> dict:
    with open(image_path, "rb") as f:
        image_data = f.read()

    openEPI_result = openEPI_api(image_data, model_type)
    kindwise_result = kindwise_api(image_path, image_data, latitude, longitude, similar_images)
    

    return simplify_prediction_result({"kindwise_result": kindwise_result, "openEPI_result": openEPI_result})
