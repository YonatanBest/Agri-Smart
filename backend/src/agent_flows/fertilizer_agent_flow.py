import asyncio
from datetime import datetime
from src.ext_apis.soil_api import openepi_soil_type
from src.ext_apis.weather_api import fetch_weather_summary
from src.services.web_search_service import search_web
from src.services.gemini_service import query_gemini
from src.services.confidence_scorer import score_confidence

async def fertilizer_agent_flow(lat: float, lon: float, area: float, crop_type: str, dt: datetime, gemini_api_key: str):
    agent_trace = []
    alerts = []
    # 1. Fetch soil and weather data from APIs
    soil = await openepi_soil_type(lat, lon)
    agent_trace.append("Fetched soil data using openepi_soil_type API.")
    weather = await fetch_weather_summary(lat, lon)
    agent_trace.append("Fetched weather data using fetch_weather_summary API.")
    # 2. Break down the problem into sub-questions
    sub_questions = [
        f"Current and forecasted weather for {lat},{lon} as of {dt.strftime('%Y-%m-%d')}",
        f"Best fertilizers for {soil} soil and {crop_type} crop",
        f"Regional/local fertilizer guidelines for {crop_type} in {lat},{lon}",
        f"Application rate best practices for {crop_type} in {area} hectares"
    ]
    agent_trace.append("Agent broke down the problem into sub-questions.")
    # 3. Autonomous web search for each sub-question
    web_results_nested = await asyncio.gather(*(search_web(q) for q in sub_questions))
    # 4. Summarize and deduplicate evidence
    all_evidence = []
    seen_urls = set()
    for group in web_results_nested:
        for item in group:
            if item["url"] not in seen_urls:
                all_evidence.append(item)
                seen_urls.add(item["url"])
    agent_trace.append(f"Agent performed web search for each sub-question and summarized {len(all_evidence)} unique evidence items.")
    # 5. Pass all evidence and user input to Gemini for reasoning
    user_inputs = {
        "soil_type": soil,
        "weather_conditions": weather,
        "crop_type": crop_type,
        "location": (lat, lon),
        "area": area,
        "datetime": dt
    }
    gemini_reco = await query_gemini(user_inputs, all_evidence, gemini_api_key)
    agent_trace.append("Agent used Gemini LLM to reason over all evidence and generate the final recommendation.")
    # 6. Confidence scoring (use Gemini's confidence if available, else fallback)
    confidence = score_confidence(gemini_reco, all_evidence)
    agent_trace.append(f"Assigned confidence score based on Gemini and web evidence.")
    if confidence < 0.7:
        alerts.append("Confidence is below 0.7, please consult a local expert.")
    # 7. Return structured result
    return {
        "best_fertilizer_recommendation": gemini_reco.get("best_fertilizer_recommendation", gemini_reco.get("recommendation", "")),
        "application_rate": gemini_reco.get("application_rate", ""),
        "rationale": gemini_reco.get("rationale", ""),
        "confidence_score": confidence,
        "sources_used": gemini_reco.get("sources_used", gemini_reco.get("sources", [])),
        "agent_thinking": gemini_reco.get("agent_thinking", gemini_reco.get("agent_reasoning", "")),
        "timestamp": gemini_reco.get("timestamp", dt.isoformat()),
        "alerts": alerts,
        "agent_trace": agent_trace,
        "evidence": all_evidence
    } 