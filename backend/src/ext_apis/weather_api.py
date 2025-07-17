import requests

BASE_URL = "https://api.met.no/weatherapi/locationforecast/2.0"

COMPACT_URL = f"{BASE_URL}/compact"
COMPLETE_URL = f"{BASE_URL}/complete"
Location_URL = f"{BASE_URL}/locations"


# let use real - email -- reminder 
HEADERS = {
    "User-Agent": "AgriSmartApp/1.0 fraolbacha111@gmail.com"
}

def fetch_weather_forecast(lat: float, lon: float, altitude: int = 90):
    params = {
        "lat": lat,
        "lon": lon,
        "altitude": altitude
    }

    response = requests.get(COMPACT_URL, params=params, headers=HEADERS)

    if response.status_code != 200:
        raise Exception(f"API Error: {response.status_code} - {response.text}")
    
    return response.json()
