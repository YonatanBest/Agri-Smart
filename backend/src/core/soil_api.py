import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Constants
TOKEN_URL = "https://account.soilhive.ag/oauth/token"
DATASETS_URL = "https://api.soilhive.ag/datasets"

# Credentials
CLIENT_ID = os.getenv("SOILHIVE_CLIENT_ID")
CLIENT_SECRET = os.getenv("SOILHIVE_CLIENT_SECRET")

def get_soilhive_token() -> str:
    data = {
        "grant_type": "client_credentials",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
    }

    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    response = requests.post(TOKEN_URL, data=data, headers=headers)

    if response.status_code != 200:
        raise Exception(f"Token error: {response.status_code} - {response.text}")

    return response.json()["access_token"]

def get_soilhive_datasets(token: str) -> dict:
    headers = {
        "Authorization": f"Bearer {token}"
    }

    response = requests.get(DATASETS_URL, headers=headers)

    if response.status_code != 200:
        raise Exception(f"Data fetch error: {response.status_code} - {response.text}")

    return response.json()
