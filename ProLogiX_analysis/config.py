import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SENTIMENT_MODEL = os.getenv("SENTIMENT_MODEL", "distilbert-base-uncased-finetuned-sst-2-english")
    SUMMARIZATION_MODEL = os.getenv("SUMMARIZATION_MODEL", "facebook/bart-large-cnn")
    MAX_INPUT_LENGTH = int(os.getenv("MAX_INPUT_LENGTH", 1000))
    MAX_SUMMARY_INPUT_LENGTH = int(os.getenv("MAX_SUMMARY_INPUT_LENGTH", 10000))
    DEBUG = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    MAX_SUMMARY_LENGTH = int(os.getenv("MAX_SUMMARY_LENGTH", 100))
    MIN_SUMMARY_LENGTH = int(os.getenv("MIN_SUMMARY_LENGTH", 30))

CONFIG = Config()