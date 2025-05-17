import os

CONFIG = {
    "SENTIMENT_MODEL": "distilbert-base-uncased-finetuned-sst-2-english",
    "SUMMARIZATION_MODEL": "facebook/bart-large-cnn",
    "MAX_INPUT_LENGTH": 1000,
    "MAX_SUMMARY_INPUT_LENGTH": 10000,
    "DEBUG": os.getenv("FLASK_DEBUG", "False") == "True"
}