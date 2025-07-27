from google.cloud import translate_v2 as translate
from deep_translator import GoogleTranslator, single_detection
from dotenv import load_dotenv
import os

load_dotenv()


class TranslationServiceFallBack:
    def __init__(self):
        pass

    def detect_language(self, text: str) -> str:
        return single_detection(text, api_key=os.getenv("DETECT_LANGUAGE_API"))

    def translate_to_english(self, text: str) -> str:
        return GoogleTranslator(source="auto", target="en").translate(text)

    def translate_from_english(self, text: str, dest_lang: str) -> str:
        return GoogleTranslator(source="en", target=dest_lang).translate(text)


translation_fallback_service = TranslationServiceFallBack()


class GoogleCloudTranslate:
    def __init__(self):
        self.translate_client = translate.Client.from_service_account_json(
            "gcp_key.json"
        )

    def detect_language(self, text: str) -> str:
        result = self.translate_client.detect_language(text)
        # result['language'] is the detected language code
        return result["language"]

    def translate_to_english(self, text: str) -> str:
        result = self.translate_client.translate(text, target_language="en")
        return result["translatedText"]

    def translate_from_english(self, text: str, dest_lang: str) -> str:
        result = self.translate_client.translate(
            text, source_language="en", target_language=dest_lang
        )
        return result["translatedText"]


translation_service = GoogleCloudTranslate()
