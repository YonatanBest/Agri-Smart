import requests
from dotenv import load_dotenv
import os
import tempfile
from PIL import Image
import httpx


load_dotenv()


def simplify_prediction_result(prediction: dict) -> dict:
    kindwise = prediction.get("kindwise_result", {})
    openepi_raw = prediction.get("openEPI_result", {})
    deepl_raw = prediction.get("deepl_result", {})

    # Process openEPI result
    openepi = {
        "healthy": openepi_raw.get("HLT", 0),
        "not_healthy": openepi_raw.get("NOT_HLT", 0),
    }

    # Process kindwise result
    diseases = []
    for suggestion in (
        kindwise.get("result", {}).get("disease", {}).get("suggestions", [])
    ):
        if suggestion.get("probability", 0) > 0.2:
            similar_images = [
                {"url": img["url"], "citation": img.get("citation", "")}
                for img in suggestion.get("similar_images", [])
            ]
            diseases.append(
                {
                    "name": suggestion["name"],
                    "probability": suggestion["probability"],
                    "scientific_name": suggestion["scientific_name"],
                    "similar_images": similar_images,
                }
            )

    crops = []
    for crop in kindwise.get("result", {}).get("crop", {}).get("suggestions", []):
        similar_images = [
            {"url": img["url"], "citation": img.get("citation", "")}
            for img in crop.get("similar_images", [])
        ]
        crops.append(
            {
                "name": crop["name"],
                "probability": crop["probability"],
                "scientific_name": crop["scientific_name"],
                "similar_images": similar_images,
            }
        )

    is_plant = kindwise.get("result", {}).get("is_plant", {}).get("binary", False)

    # Process deepl_raw result - filtered to useful fields
    deepl_data = deepl_raw.get("data", {})
    deepl_filtered = {
        "crops": deepl_data.get("crops", []),
        "diagnoses_detected": deepl_data.get("diagnoses_detected", False),
        "image_feedback": deepl_data.get("image_feedback", {}),
        "diagnoses": []
    }
    for diag in deepl_data.get("predicted_diagnoses", []):
        filtered_diag = {
            "common_name": diag.get("common_name"),
            "diagnosis_likelihood": diag.get("diagnosis_likelihood"),
            "scientific_name": diag.get("scientific_name"),
            "pathogen_class": diag.get("pathogen_class"),
            "symptoms_short": diag.get("symptoms_short", []),
            "preventive_measures": diag.get("preventive_measures", []),
            "treatment_chemical": diag.get("treatment_chemical"),
            "treatment_organic": diag.get("treatment_organic"),
            "trigger": diag.get("trigger"),
        }
        deepl_filtered["diagnoses"].append(filtered_diag)
        
        
    print("after ------------------------------")
    print(deepl_filtered)

    return {
        "kindwise": {"is_plant": is_plant, "diseases": diseases, "crops": crops},
        "openepi": openepi,
        "deepl": deepl_filtered,
    }


def openEPI_api(image_data: object, model_type: str = "binary") -> dict:
    openEPI_result = {}

    url = "https://api.openepi.io/crop-health/predictions/binary"
    if not url:
        raise ValueError(
            "Invalid model type. Choose 'binary', 'single', or 'multi' for the openEPI api"
        )

    try:
        response = requests.post(
            url, data=image_data, headers={"Content-Type": "image/jpeg"}
        )
        response.raise_for_status()
        openEPI_result = response.json()
    except requests.exceptions.HTTPError as e:
        print(f"HTTP error occurred: {e}")
        print(f"Response content: {response.content}")
        raise RuntimeError(
            f"OpenEPI API error: {str(e)} | Response: {response.content.decode()}"
        )
    except Exception as e:
        print(f"Unknown Error occurred: {e}")
        raise RuntimeError(f"OpenEPI API unknown error: {str(e)}")

    return openEPI_result


def kindwise_api(
    image_path: str,
    image_data: object,
    latitude: str = 49.5,
    longitude: str = 45,
    similar_images: bool = True,
) -> dict:
    URL = "https://crop.kindwise.com/api/v1/identification"

    headers = {"Api-Key": os.getenv("KINDWISE_API_KEY")}

    form_data = {
        "latitude": latitude,
        "longitude": longitude,
        "similar_images": str(similar_images).lower(),
    }

    files = {"images": (image_path, image_data, "image/jpeg")}

    try:
        kindwise_res = requests.post(URL, headers=headers, data=form_data, files=files)
        kindwise_res.raise_for_status()
        kindwise_result = kindwise_res.json()
    except requests.exceptions.RequestException as e:
        print(f"HTTP error occurred: {e}")
        raise RuntimeError(f"Kindwise API error: {str(e)}")
    except Exception as e:
        print(f"Unknown Error occurred: {e}")
        raise RuntimeError(f"Kindwise API unknown error: {str(e)}")

    if isinstance(kindwise_result, dict) and "error" in kindwise_result:
        raise RuntimeError(f"Kindwise API error: {kindwise_result['error']}")

    return kindwise_result



# external_api/deepleaf.py

DEEPL_API_URL = "https://api.deepleaf.io/analyze"
API_KEY = os.getenv("DEEPL_API_KEY")

MIN_SIZE = 200
MAX_SIZE = 2000


def ensure_min_resolution(image_path: str) -> str:
    """
    Check if image resolution is >= MIN_SIZE x MIN_SIZE.
    If smaller, resize proportionally to minimum 200x200.
    Returns path to valid image (same path or temp resized image).
    """
    with Image.open(image_path) as img:
        width, height = img.size

        if width >= MIN_SIZE and height >= MIN_SIZE:
            # Image resolution is fine
            return image_path

        # Calculate scale factor to make smallest dimension MIN_SIZE
        scale = MIN_SIZE / min(width, height)
        new_width = int(width * scale)
        new_height = int(height * scale)

        # Cap size to max if needed
        if new_width > MAX_SIZE or new_height > MAX_SIZE:
            scale = min(MAX_SIZE / new_width, MAX_SIZE / new_height)
            new_width = int(new_width * scale)
            new_height = int(new_height * scale)

        resized_img = img.resize((new_width, new_height), Image.LANCZOS)

        # Save resized image to a temp file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
        resized_img.save(temp_file.name, format="JPEG")
        temp_file.close()

        return temp_file.name


async def deepl_analyze_leaf(image_path: str, lat: float, lon: float, language: str = "en") -> dict:
    # Ensure image resolution meets minimum requirements
    valid_image_path = ensure_min_resolution(image_path)

    print("deeply, api key", API_KEY)
    params = {
        "api_key": API_KEY,
        "language": language,
        "lat": lat,
        "lon": lon,
    }

    try:
        with open(valid_image_path, "rb") as img_file:
            files = {"image": (valid_image_path, img_file, "image/jpeg")}

            async with httpx.AsyncClient() as client:
                response = await client.post(DEEPL_API_URL, params=params, files=files)

        if not response.status_code == 200:
            return {"error": f"Request failed: {response.status_code}", "details": response.text}

        return response.json()

    except FileNotFoundError:
        return {"error": "Image file not found"}
    except httpx.RequestError as e:
        return {"error": "HTTP error", "details": str(e)}
    except Exception as e:
        return {"error": "Unexpected error", "details": str(e)}

    finally:
        # Remove temp resized file if created
        if valid_image_path != image_path:
            try:
                os.remove(valid_image_path)
            except Exception:
                pass



async def predict_crop_health(
    image_path: str,
    model_type: str = "binary",
    latitude: float = 49.5,
    longitude: float = 45,
    similar_images: bool = True,
) -> dict:
    with open(image_path, "rb") as f:
        image_data = f.read()

    openEPI_result = openEPI_api(image_data, model_type)

    kindwise_result = {}
    deepl_result = {}

    kindwise_failed = False
    deepl_failed = False

    # Try Kindwise
    try:
        kindwise_result = kindwise_api(image_path, image_data, latitude, longitude, similar_images)
    except Exception as e:
        kindwise_failed = True
        print(f"[Kindwise Failed] {e}")

    # Try DeepLeaf
    try:
        deepl_result = await deepl_analyze_leaf(image_path, latitude, longitude)
        if "error" in deepl_result:
            deepl_failed = True
            print(f"[DeepLeaf API Error] {deepl_result['error']}")
    except Exception as e:
        deepl_failed = True
        print(f"[DeepLeaf Failed] {e}")

    # If both failed, raise or return error
    if kindwise_failed and deepl_failed:
        raise RuntimeError("Both Kindwise and DeepLeaf APIs failed. Unable to analyze crop health.")


    return simplify_prediction_result(
        {
            "kindwise_result": kindwise_result,
            "openEPI_result": openEPI_result,
            "deepl_result": deepl_result,
        }
    )


