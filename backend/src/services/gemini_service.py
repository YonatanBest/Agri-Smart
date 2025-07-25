import os
import httpx
import json
from datetime import datetime

GEMINI_MODEL = "gemini-2.5-flash"
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"

async def query_gemini(soil, weather, area, crop_type, web_results, dt):
    # Summarize web evidence for the prompt
    web_evidence = "\n".join([
        f"Source: {w.get('source', '')}, URL: {w.get('url', '')}, Summary: {w.get('summary', '')}, Timestamp: {w.get('timestamp', '')}" for w in web_results
    ])
    prompt = (
        f"You are an expert agronomist AI agent.\n"
        f"Given the following information, recommend the best fertilizer and application rate for optimal yield.\n"
        f"Soil: {soil}\n"
        f"Weather: {weather}\n"
        f"Crop: {crop_type}\n"
        f"Area: {area} hectares.\n"
        f"Datetime: {dt.isoformat() if isinstance(dt, datetime) else dt}\n"
        f"Web evidence from trusted sources:\n{web_evidence}\n"
        f"Please reason step by step, cross-reference the web evidence with the input data, and return:\n"
        f"- recommendation (fertilizer type)\n- application_rate\n- rationale\n- confidence (0-1)\n- sources (list of URLs or titles)\n- timestamp (now)\n- agent_reasoning (explain your process and which sources you used)\n"
        f"Respond in JSON format with keys: recommendation, application_rate, rationale, confidence, sources, timestamp, agent_reasoning."
    )
    url = f"{GEMINI_BASE_URL}chat/completions?model={GEMINI_MODEL}"
    headers = {"Authorization": f"Bearer {GEMINI_API_KEY}", "Content-Type": "application/json"}
    data = {
        "model": GEMINI_MODEL,
        "messages": [
            {"role": "system", "content": "You are an expert agronomist."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 512,
        "temperature": 0.7
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        # Try to extract the answer from Gemini's response
        try:
            content = result["choices"][0]["message"]["content"]
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