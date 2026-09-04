"""Shared Featherless OpenAI client instance."""

import os
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.environ.get("FEATHERLESS_API_KEY", "dummy-key")
MODEL_NAME = "Qwen/Qwen2.5-Coder-32B-Instruct"

client = OpenAI(
    api_key=api_key if api_key and api_key != "your_featherless_api_key_here" else "dummy-key",
    base_url="https://api.featherless.ai/v1"
)

def is_featherless_configured() -> bool:
    """Returns True if a valid Featherless API key is present in .env."""
    k = os.environ.get("FEATHERLESS_API_KEY", "")
    return bool(k and k != "your_featherless_api_key_here" and len(k) > 10)
