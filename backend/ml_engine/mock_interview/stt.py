import io
import os
from groq import Groq

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "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")
os.environ["GROQ_API_KEY"] = GROQ_API_KEY  # ensure child processes inherit it

_MIME_TO_EXT = {
    "audio/webm":              "webm",
    "audio/webm;codecs=opus":  "webm",
    "audio/ogg":               "ogg",
    "audio/ogg;codecs=opus":   "ogg",
    "audio/mp4":               "mp4",
    "audio/mpeg":              "mp3",
    "audio/wav":               "wav",
    "audio/x-wav":             "wav",
}

_MIN_AUDIO_BYTES = 1000

_WHISPER_PROMPT = (
    "Interview answer. Technical discussion about software engineering, "
    "Python, JavaScript, machine learning, APIs, databases, system design, "
    "React, Docker, cloud, algorithms, data structures."
)

_BLANK_PATTERNS = {"[blank_audio]", "(blank audio)", "[inaudible]", "(inaudible)"}


def transcribe_audio_bytes(audio_bytes: bytes, content_type: str = "audio/webm") -> str:
    if GROQ_API_KEY == "YOUR_API_KEY_HERE":
        return "This is a local dummy transcription since no valid GROQ API key was provided. I am using fallback text to prevent crashes."

    if not audio_bytes or len(audio_bytes) < _MIN_AUDIO_BYTES:
        return ""

    client = Groq(api_key=GROQ_API_KEY)
    
    mime_base = content_type.split(";")[0].strip().lower()
    ext = _MIME_TO_EXT.get(content_type.lower().strip(),
          _MIME_TO_EXT.get(mime_base, "webm"))

    filename = f"audio.{ext}"

    try:
        transcription = client.audio.transcriptions.create(
            file=(filename, io.BytesIO(audio_bytes)),
            model="whisper-large-v3-turbo",
            response_format="text",
            language="en",
            temperature=0.0,
            prompt=_WHISPER_PROMPT,
        )
        result = str(transcription).strip() if transcription else ""

        if result.lower() in _BLANK_PATTERNS:
            return ""

        return result
    except Exception as e:
        print(f"[stt] Transcription error: {e}")
        return ""
