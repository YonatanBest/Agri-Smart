from src.services.llm_service import LLMService
from src.ext_apis.crop_health_api import predict_crop_health
import os


async def diagnosis_flow(
    image_path: str,
) -> dict:
    """
    Orchestrates the crop health diagnosis flow:
    - Calls OpenEPI and Kindwise APIs with the given image.
    - Simplifies and combines the results.
    - Passes the results to the LLM for a human-readable, farmer-friendly insight.
    - Returns both the LLM's insight and the raw API results.
    """

    combined_result = await predict_crop_health(image_path)
    prompt = (
        "You are an expert agricultural advisor for smallholder farmers.\n"
        "You will receive crop health diagnosis results from different api's.\n"
        "Your job is to:\n"
        "1. Clearly state what crop is in the image.\n"
        "2. Clearly state if the crop is healthy or not.\n"
        "3. If not healthy, list the most likely diseases and describe in simple terms what they are and what symptoms to look for.\n"
        "4. Give the farmer 2-3 specific, practical next steps they should take right now. Be direct and encouraging.\n"
        "5. Avoid technical jargon, do not mention probabilities or confidence levels, and do not mention the tools or sources used.\n"
        "6. If the crop is healthy, give a short, positive message and one tip for keeping it healthy.\n"
        "\n"
        "Format your answer as:\n"
        "Crop: <most likely crop>\n"
        "Health: <healthy/not healthy>\n"
        "Likely Diseases: <list with simple descriptions>\n"
        "What to do now: <2-3 clear, practical steps>\n"
        "Encouragement: <one-sentence positive message>\n"
        "\n"
        f"Diagnosis Results (JSON):\n{combined_result}\n"
        "\nPlease provide your advice in a way that is easy for a farmer to understand."
    )

    llm = LLMService()
    llm_response = llm.send_message(prompt)

    return {"insight": llm_response.get("response"), "raw_results": combined_result}
