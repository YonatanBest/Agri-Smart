from src.services.llm_service import LLMService
from src.ext_apis.crop_health_api import predict_crop_health
from src.ext_apis.soil_api import get_soil_summary_async
from src.ext_apis.weather_api import fetch_weather_summary, simplify_weather_response
import asyncio
from src.services.llm_service import llm_service
from typing import Optional


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

    llm_response = llm_service.send_message(prompt)

    return {"insight": llm_response.get("response"), "raw_results": combined_result}


async def recommend_crops_flow(
    lat: float,
    lon: float,
    depth: str = "0-20",
    top_k: int = 5,
    past_days: int = 30,
    forecast_days: int = 0,
) -> dict:
    """
    Orchestrates the crop recommendation flow:
    - Gets simplified soil and weather summaries.
    - Builds a prompt for the LLM.
    - Returns the LLM's crop recommendation and the input data.
    """
    # Fetch soil and weather summaries in parallel
    soil_task = get_soil_summary_async(lat, lon, depth, top_k)
    weather_task = fetch_weather_summary(lat, lon, past_days, forecast_days)
    soil_summary, weather_raw = await asyncio.gather(soil_task, weather_task)
    weather_summary = simplify_weather_response(weather_raw)

    # Build LLM prompt
    prompt = (
        "You are an expert agricultural advisor. Here is the soil and weather information for a farmer's field:\n"
        f"Soil:\n"
        f"- Soil type: {soil_summary.get('soil_type')}\n"
        f"- Texture: {soil_summary.get('texture_class')}\n"
        f"- pH: {soil_summary.get('ph')}\n"
        f"- Nitrogen: {soil_summary.get('nitrogen_total_g_per_kg')} g/kg\n"
        f"- Phosphorous: {soil_summary.get('phosphorous_extractable_ppm')} ppm\n"
        f"- Potassium: {soil_summary.get('potassium_extractable_ppm')} ppm\n"
        f"- Cation Exchange Capacity: {soil_summary.get('cation_exchange_capacity_cmol_per_kg')} cmol(+)/kg\n"
        f"- Organic Carbon: {soil_summary.get('carbon_organic_g_per_kg')} g/kg\n"
        f"\nWeather (last {past_days} days):\n"
        f"- Average max temperature: {weather_summary.get('avg_temperature_max')}°C\n"
        f"- Average min temperature: {weather_summary.get('avg_temperature_min')}°C\n"
        f"- Total rainfall: {weather_summary.get('total_rainfall_mm')} mm\n"
        f"- Average sunshine hours: {weather_summary.get('avg_sunshine_hours')}\n"
        f"- Average wind speed: {weather_summary.get('avg_wind_speed_kph')} kph\n"
        f"- Average evapotranspiration: {weather_summary.get('avg_evapotranspiration')}\n"
        "\nBased on this information, recommend the 2-3 most suitable crops to plant now. For each crop, explain why it is suitable, and give 1-2 practical tips for success. Be specific, practical, and use simple language for a smallholder farmer."
    )

    llm_response = llm_service.send_message(prompt)

    return {
        "recommendation": llm_response.get("response"),
        "soil_summary": soil_summary,
        "weather_summary": weather_summary,
    }

async def recommend_fertilizer_flow(
    lat: float,
    lon: float,
    target_crop: str,
    depth: str = "0-20",
    top_k: int = 5,
    past_days: int = 30,
    forecast_days: int = 0,
    previous_crop: Optional[str] = None,
    growth_stage: Optional[str] = None,
) -> dict:
    """
    Orchestrates the fertilizer recommendation flow:
    - Gets simplified soil and weather summaries.
    - Adds rule-based deficiency detection if NPK is missing.
    - Builds a prompt for the LLM including previous crop and growth stage.
    - Returns the fertilizer recommendation and the input data.
    """

    # Fetch soil and weather summaries in parallel
    soil_task = get_soil_summary_async(lat, lon, depth, top_k)
    weather_task = fetch_weather_summary(lat, lon, past_days, forecast_days)
    soil_summary, weather_raw = await asyncio.gather(soil_task, weather_task)
    weather_summary = simplify_weather_response(weather_raw)

    # --- Rule-based deficiency detection if NPK missing ---
    deficiency_notes = []
    # Nitrogen
    if soil_summary.get('nitrogen_total_g_per_kg') is None:
        if soil_summary.get('texture_class', '').lower() == 'sandy':
            deficiency_notes.append('Sandy soil: likely poor nitrogen retention. Consider more nitrogen fertilizer.')
    # Phosphorus
    if soil_summary.get('phosphorous_extractable_ppm') is None:
        ph = soil_summary.get('ph')
        if ph is not None and ph < 5.5:
            deficiency_notes.append('Low pH (<5.5): likely poor phosphorus availability.')
    # Potassium
    if soil_summary.get('potassium_extractable_ppm') is None:
        cec = soil_summary.get('cation_exchange_capacity_cmol_per_kg')
        if cec is not None and cec < 10:
            deficiency_notes.append('Low CEC (<10): soil may not hold potassium well.')
    # General
    if not deficiency_notes and (
        soil_summary.get('nitrogen_total_g_per_kg') is None or
        soil_summary.get('phosphorous_extractable_ppm') is None or
        soil_summary.get('potassium_extractable_ppm') is None
    ):
        deficiency_notes.append('Some nutrient data missing; use soil pH, texture, and CEC as indirect indicators.')
    deficiency_text = '\n'.join(deficiency_notes) if deficiency_notes else 'Nutrient data available.'

    # --- Crop rotation and growth stage notes ---
    rotation_note = ''
    if previous_crop:
        if previous_crop.lower() in ['maize', 'corn'] and target_crop.lower() in ['beans', 'legume', 'soybean', 'groundnut']:
            rotation_note = 'Good rotation: legumes after maize help fix nitrogen.'
        elif previous_crop.lower() == target_crop.lower():
            rotation_note = 'Avoid growing the same crop consecutively to reduce disease risk and nutrient depletion.'
        else:
            rotation_note = f'Previous crop: {previous_crop}. Consider rotation best practices.'
    growth_stage_note = ''
    if growth_stage:
        if growth_stage.lower() == 'germination':
            growth_stage_note = 'Focus on phosphorus-rich (DAP) fertilizer for root development.'
        elif growth_stage.lower() == 'vegetative':
            growth_stage_note = 'Nitrogen is important for leafy growth.'
        elif growth_stage.lower() == 'flowering':
            growth_stage_note = 'Potassium is important for flowering.'
        elif growth_stage.lower() == 'fruiting':
            growth_stage_note = 'Potassium-boosted fertilizer helps fruit/seed development.'
        else:
            growth_stage_note = f'Growth stage: {growth_stage}.'

    # Build LLM prompt
    prompt = (
        "You are a professional agronomist helping smallholder farmers apply the right fertilizer.\n"
        f"Crop to be grown: {target_crop}\n\n"
        f"Previous crop: {previous_crop or 'Not provided'}\n"
        f"Growth stage: {growth_stage or 'Not provided'}\n"
        f"Rotation note: {rotation_note}\n"
        f"Growth stage note: {growth_stage_note}\n"
        f"\n\U0001F324 Weather (last {past_days} days):\n"
        f"- Avg max temperature: {weather_summary.get('avg_temperature_max')}°C\n"
        f"- Avg min temperature: {weather_summary.get('avg_temperature_min')}°C\n"
        f"- Total rainfall: {weather_summary.get('total_rainfall_mm')} mm\n"
        f"- Avg sunshine hours: {weather_summary.get('avg_sunshine_hours')} hrs\n"
        f"- Avg wind speed: {weather_summary.get('avg_wind_speed_kph')} kph\n"
        f"- Avg evapotranspiration: {weather_summary.get('avg_evapotranspiration')}\n"
        "\n\U0001F3AF Task:\n"
        "Recommend the best fertilizer plan for this field based on the soil and weather conditions, crop rotation, and growth stage.\n"
        "Mention the nutrient(s) that are lacking or need support.\n"
        "Suggest both organic and chemical options if possible.\n"
        "Give specific dosages per hectare, and explain when and how to apply.\n"
        "Use practical, farmer-friendly language. Keep it short and actionable.\n"
        "\nHere is the soil and weather information for a farmer's field:\n"
        f"4cd Soil:\n"
        f"- Soil type: {soil_summary.get('soil_type')}\n"
        f"- Texture: {soil_summary.get('texture_class')}\n"
        f"- pH: {soil_summary.get('ph')}\n"
        f"- Nitrogen: {soil_summary.get('nitrogen_total_g_per_kg')} g/kg\n"
        f"- Phosphorous: {soil_summary.get('phosphorous_extractable_ppm')} ppm\n"
        f"- Potassium: {soil_summary.get('potassium_extractable_ppm')} ppm\n"
        f"- Cation Exchange Capacity: {soil_summary.get('cation_exchange_capacity_cmol_per_kg')} cmol(+)/kg\n"
        f"- Organic Carbon: {soil_summary.get('carbon_organic_g_per_kg')} g/kg\n"
        f"\nDeficiency notes: {deficiency_text}\n"
        f"\n"
    )

    llm_response = llm_service.send_message(prompt)

    return {
        "recommendation": llm_response.get("response"),
        "soil_summary": soil_summary,
        "weather_summary": weather_summary,
        "deficiency_notes": deficiency_notes,
        "rotation_note": rotation_note,
        "growth_stage_note": growth_stage_note,
    }