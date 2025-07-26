import os
import httpx
import json
from datetime import datetime
import re

GEMINI_MODEL = "gemini-2.5-flash"
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"

async def query_gemini(user_inputs, web_results, gemini_api_key=None):
    soil = user_inputs.get("soil_type")
    weather = user_inputs.get("weather_conditions")
    area = user_inputs.get("area")
    crop_type = user_inputs.get("crop_type")
    dt = user_inputs.get("datetime")
    # Summarize web evidence for the prompt
    web_evidence = "\n".join([
        f"Source: {w.get('source', '')}, URL: {w.get('url', '')}, Summary: {w.get('summary', '')}, Timestamp: {w.get('timestamp', '')}" for w in web_results
    ])
    prompt = (
        "You are an expert agronomist AI agent.\n"
        "Given the following information, recommend the best fertilizer and application rate for optimal yield.\n"
        f"Soil: {soil}\n"
        f"Weather: {weather}\n"
        f"Crop: {crop_type}\n"
        f"Area: {area} hectares.\n"
        f"Datetime: {dt.isoformat() if isinstance(dt, datetime) else dt}\n"
        f"Web evidence from trusted sources:\n{web_evidence}\n"
        "Please reason step by step, cross-reference the web evidence with the input data, and return:\n"
        "- recommendation (fertilizer type, e.g., NPK 20-10-10, Urea, DAP, etc.)\n"
        "- application_rate (e.g., kg/ha, or total kg for the area)\n"
        "- rationale (why this recommendation is best)\n"
        "- confidence (0-1)\n"
        "- sources (list of URLs or titles)\n"
        "- timestamp (now)\n"
        "- agent_reasoning (explain your process and which sources you used)\n"
        "You MUST always provide a recommendation, application rate, and rationale, even if confidence is low or evidence is limited.\n"
        "Respond with ONLY a valid JSON object with keys: recommendation, application_rate, rationale, confidence, sources, timestamp, agent_reasoning. Do not include any text, markdown, or code block outside the JSON.\n"
        "Example response:\n"
        "{\n  \"recommendation\": \"NPK 20-10-10\",\n  \"application_rate\": \"120 kg/ha\",\n  \"rationale\": \"Based on the soil and crop type, and supported by evidence from [source], NPK 20-10-10 is optimal.\",\n  \"confidence\": 0.85,\n  \"sources\": [\"https://example.com/fertilizer-guidelines\"],\n  \"timestamp\": \"2024-07-25T10:17:27.635963\",\n  \"agent_reasoning\": \"I cross-referenced the soil and crop type with the provided evidence and selected the most relevant recommendation.\"\n}\n"
    )
    url = f"{GEMINI_BASE_URL}/{GEMINI_MODEL}:generateContent?key={gemini_api_key or GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [
            {"role": "user", "parts": [{"text": prompt}]}
        ]
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        try:
            content = result["candidates"][0]["content"]["parts"][0]["text"]
            print("Gemini raw response:", content)  # Log raw response
            # Remove code block markers if present
            content = re.sub(r"^```(?:json)?|```$", "", content.strip(), flags=re.MULTILINE).strip()
            parsed = json.loads(content)
            return {
                "recommendation": parsed.get("recommendation"),
                "application_rate": parsed.get("application_rate"),
                "rationale": parsed.get("rationale"),
                "confidence": parsed.get("confidence"),
                "sources": parsed.get("sources"),
                "timestamp": parsed.get("timestamp"),
                "agent_reasoning": parsed.get("agent_reasoning", "")
            }
        except Exception:
            return {"gemini_response": str(result)}

async def gemini_suggest_search(soil, weather, area, crop_type):
    prompt = (
        f"You are an expert agronomist AI agent. "
        f"Given the following information:\n"
        f"Soil: {soil}\nWeather: {weather}\nCrop: {crop_type}\nArea: {area} hectares.\n"
        f"What web search queries would help you recommend the best fertilizer and application rate? "
        f"Return a list of 2-3 search queries in JSON array format."
    )
    url = f"{GEMINI_BASE_URL}/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [
            {"role": "user", "parts": [{"text": prompt}]}
        ]
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        try:
            content = result["candidates"][0]["content"]["parts"][0]["text"]
            queries = json.loads(content) if content.strip().startswith("[") else [content.strip()]
            return queries
        except Exception:
            return [] 