import httpx
import asyncio
from datetime import datetime
from dateutil.relativedelta import relativedelta

# Define URLs and headers
BASE_URL = "https://api.met.no/weatherapi/locationforecast/2.0"
COMPACT_URL = f"{BASE_URL}/compact"
NASA_POWER_URL = "https://power.larc.nasa.gov/api/temporal/monthly/point"



HEADERS = {
    "User-Agent": "AgriSmartApp/1.0 fraolbacha111@gmail.com"
}



async def async_fetch_weather_forecast(client, lat: float, lon: float, altitude: int = 90):
    params = {
        "lat": lat,
        "lon": lon,
        "altitude": altitude
    }
    try:
        response = await client.get(COMPACT_URL, params=params, headers=HEADERS)
        response.raise_for_status()
        return {"api": "openmeteo", "result": response.json()}
    except httpx.HTTPStatusError as e:
        print(f"Open-Meteo HTTP error: {e}")
        return {"api": "openmeteo", "error": str(e), "details": e.response.text}
    except httpx.RequestError as e:
        print(f"Open-Meteo network error: {e}")
        return {"api": "openmeteo", "error": "Network error", "details": str(e)}
    except Exception as e:
        print(f"Open-Meteo unknown error: {e}")
        return {"api": "openmeteo", "error": "Unexpected error", "details": str(e)}



async def async_get_nasa_historical_weather(client, latitude: float, longitude: float, months: int = 4, years: int = 5):
    now = datetime.utcnow()
    start_month = now.month

    all_data = []

    try:
        for i in range(1, years + 1):
            target_year = now.year - i
            params = {
                "parameters": "PRECTOT,T2M,T2M_MAX,ALLSKY_SFC_SW_DWN",
                "community": "AG",
                "longitude": longitude,
                "latitude": latitude,
                "start": target_year,
                "end": target_year,
                "format": "JSON"
            }

            response = await client.get(NASA_POWER_URL, params=params)
            response.raise_for_status()
            data = response.json()
            monthly_data = data.get("properties", {}).get("parameter", {})

            for m in range(months):
                month_number = (start_month + m - 1) % 12 + 1
                year = target_year if (start_month + m - 1) < 12 else target_year + 1
                key = f"{target_year}{month_number:02d}"

                month_entry = {
                    "year": target_year,
                    "month": datetime(target_year, month_number, 1).strftime("%B"),
                    "rainfall_mm": monthly_data.get("PRECTOT", {}).get(key),
                    "avg_temp_c": monthly_data.get("T2M", {}).get(key),
                    "max_temp_c": monthly_data.get("T2M_MAX", {}).get(key),
                    "solar_radiation": monthly_data.get("ALLSKY_SFC_SW_DWN", {}).get(key)
                }
                all_data.append(month_entry)

        ans = {
            "api": "nasa",
            "result": {
                "location": {"lat": latitude, "lon": longitude},
                "historical_range": f"{now.year - years} to {now.year - 1}",
                "months_analyzed": months,
                "monthly_data": all_data
            }
        }
        
        
        print(f"ans is {ans}")
        
        
        return ans
        

    except httpx.HTTPStatusError as e:
        print(f"NASA HTTP error: {e}")
        return {"api": "nasa", "error": str(e), "details": e.response.text}
    except httpx.RequestError as e:
        print(f"NASA network error: {e}")
        return {"api": "nasa", "error": "Network error", "details": str(e)}
    except Exception as e:
        print(f"NASA unknown error: {e}")
        return {"api": "nasa", "error": "Unexpected error", "details": str(e)}



async def fetch_combined_weather(lat: float, lon: float, altitude: int = 90, months: int = 4):
    # Validate inputs
    if not (-90 <= lat <= 90):
        raise ValueError("Latitude must be between -90 and 90")
    if not (-180 <= lon <= 180):
        raise ValueError("Longitude must be between -180 and 180")
    if months < 1 or months > 12:
        raise ValueError("Months must be between 1 and 12")

    async with httpx.AsyncClient(timeout=10.0) as client:
        tasks = [
            async_fetch_weather_forecast(client, lat, lon, altitude),
            async_get_nasa_historical_weather(client, lat, lon, months)
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        openmeteo_result = {}
        nasa_result = {}
        openmeteo_failed = False
        nasa_failed = False

        for result in results:
            if result["api"] == "openmeteo":
                openmeteo_result = result.get("result", {})
                if "error" in result:
                    openmeteo_failed = True
                    print(f"[Open-Meteo Failed] {result['error']}: {result.get('details', '')}")
            elif result["api"] == "nasa":
                nasa_result = result.get("result", {})
                if "error" in result:
                    nasa_failed = True
                    print(f"[NASA Failed] {result['error']}: {result.get('details', '')}")

        if openmeteo_failed and nasa_failed:
            raise RuntimeError("Both Open-Meteo and NASA APIs failed. Unable to fetch weather data.")

        return {
            "openmeteo": openmeteo_result,
            "nasa": nasa_result
        }
        
        
