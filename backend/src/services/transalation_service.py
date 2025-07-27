from deep_translator import GoogleTranslator, single_detection
from dotenv import load_dotenv
import os

load_dotenv()

class TranslationService:
    def __init__(self):
        pass

    def detect_language(self, text: str) -> str:
        return single_detection(text, api_key=os.getenv("DETECT_LANGUAGE_API"))

    def translate_to_english(self, text: str) -> str:
        return GoogleTranslator(source="auto", target="en").translate(text)

    def translate_from_english(self, text: str, dest_lang: str) -> str:
        return GoogleTranslator(source="en", target=dest_lang).translate(text)


translation_service = TranslationService()