# model.py
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
from config import CONFIG

_sentiment_pipeline = None
_summary_pipeline = None

def get_sentiment_pipeline():
    global _sentiment_pipeline
    if _sentiment_pipeline is None:
        tokenizer = AutoTokenizer.from_pretrained(CONFIG["SENTIMENT_MODEL"])
        model = AutoModelForSequenceClassification.from_pretrained(CONFIG["SENTIMENT_MODEL"])
        _sentiment_pipeline = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)
    return _sentiment_pipeline

def get_summary_pipeline():
    global _summary_pipeline
    if _summary_pipeline is None:
        _summary_pipeline = pipeline("summarization", model=CONFIG["SUMMARIZATION_MODEL"])
    return _summary_pipeline
