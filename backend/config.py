import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Priority: Gemini > OpenAI
USE_GEMINI = bool(GEMINI_API_KEY)
USE_OPENAI = bool(OPENAI_API_KEY) and not USE_GEMINI

MODEL_NAME = "gemini-1.5-flash" if USE_GEMINI else ("gpt-4o-mini" if USE_OPENAI else "llama-3.1-8b-instant")
