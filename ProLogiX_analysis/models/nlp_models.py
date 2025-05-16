from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
from config import CONFIG

class ModelManager:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialize_models()
        return cls._instance
    
    def _initialize_models(self):
        self.sentiment_pipeline = None
        self.summary_pipeline = None
    
    def get_sentiment_pipeline(self):
        if self.sentiment_pipeline is None:
            tokenizer = AutoTokenizer.from_pretrained(CONFIG.SENTIMENT_MODEL)
            model = AutoModelForSequenceClassification.from_pretrained(CONFIG.SENTIMENT_MODEL)
            self.sentiment_pipeline = pipeline(
                "sentiment-analysis", 
                model=model, 
                tokenizer=tokenizer
            )
        return self.sentiment_pipeline
    
    def get_summary_pipeline(self):
        if self.summary_pipeline is None:
            self.summary_pipeline = pipeline(
                "summarization", 
                model=CONFIG.SUMMARIZATION_MODEL
            )
        return self.summary_pipeline