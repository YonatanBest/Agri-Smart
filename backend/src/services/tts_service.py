import os
import base64
from typing import Dict, Any, Optional
from google.cloud import texttospeech
from google.cloud.texttospeech import SynthesisInput, VoiceSelectionParams, AudioConfig
import json


class TTSService:
    def __init__(self):
        # Use the same Google Cloud credentials as other services
        key_path = os.path.join(os.path.dirname(__file__), "../../", "gcp_key.json")
        key_path = os.path.abspath(key_path)
        if not os.path.exists(key_path):
            raise FileNotFoundError(f"Google Cloud credentials not found at {key_path}")

        self.client = texttospeech.TextToSpeechClient.from_service_account_json(
            key_path
        )

        # Language to voice mapping
        self.voice_mapping = {
            "en": {
                "language_code": "en-US",
                "voice_name": "en-US-Neural2-F",  # Female voice
                "speaking_rate": 0.9,
            },
            "am": {
                "language_code": "am-ET",
                "voice_name": "am-ET-Standard-A",  # Amharic voice
                "speaking_rate": 1,
            },
            "no": {
                "language_code": "no-NO",
                "voice_name": "no-NO-Standard-A",  # Norwegian voice
                "speaking_rate": 1,
            },
            "sw": {
                "language_code": "sw-KE",
                "voice_name": "sw-KE-Standard-A",  # Swahili voice
                "speaking_rate": 1,
            },
            "es": {
                "language_code": "es-ES",
                "voice_name": "es-ES-Neural2-A",  # Spanish voice
                "speaking_rate": 1,
            },
            "id": {
                "language_code": "id-ID",
                "voice_name": "id-ID-Standard-A",  # Indonesian voice
                "speaking_rate": 1,
            },
        }

    def text_to_speech(self, text: str, language: str = "en") -> Dict[str, Any]:
        """
        Convert text to speech audio

        Args:
            text: Text to convert to speech
            language: Language code (en, am, no, sw, es, id)

        Returns:
            Dict containing audio data and metadata
        """
        try:
            # Get voice configuration for the language
            voice_config = self.voice_mapping.get(language, self.voice_mapping["en"])

            # Create synthesis input
            synthesis_input = SynthesisInput(text=text)

            # Configure voice
            voice = VoiceSelectionParams(
                language_code=voice_config["language_code"],
                name=voice_config["voice_name"],
            )

            # Configure audio
            audio_config = AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.MP3,
                speaking_rate=voice_config["speaking_rate"],
                pitch=0.0,
                volume_gain_db=0.0,
            )

            # Perform text-to-speech request
            response = self.client.synthesize_speech(
                input=synthesis_input, voice=voice, audio_config=audio_config
            )

            # Convert audio content to base64 for easy transmission
            audio_base64 = base64.b64encode(response.audio_content).decode("utf-8")

            return {
                "success": True,
                "audio_base64": audio_base64,
                "audio_format": "mp3",
                "language": language,
                "text_length": len(text),
                "duration_estimate": len(text.split()) * 0.5,  # Rough estimate
            }

        except Exception as e:
            print(f"❌ TTS Error: {str(e)}")
            return {"success": False, "error": str(e), "language": language}

    def get_available_voices(self, language_code: str = None) -> Dict[str, Any]:
        """
        Get available voices for a language

        Args:
            language_code: Optional language code to filter voices

        Returns:
            Dict containing available voices
        """
        try:
            if language_code:
                voices = self.client.list_voices(language_code=language_code)
            else:
                voices = self.client.list_voices()

            return {
                "success": True,
                "voices": [
                    {
                        "name": voice.name,
                        "language_code": voice.language_codes[0],
                        "ssml_gender": voice.ssml_gender.name,
                    }
                    for voice in voices.voices
                ],
            }

        except Exception as e:
            print(f"❌ Error getting voices: {str(e)}")
            return {"success": False, "error": str(e)}


tts_service = TTSService()
