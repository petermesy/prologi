from flask import Flask, request, jsonify
from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer
from flask_cors import CORS
from functools import wraps
import logging
from typing import List, Dict, Optional
import os


app = Flask(__name__)
CORS(app)  

CONFIG = {
    "SENTIMENT_MODEL": "distilbert-base-uncased-finetuned-sst-2-english",  
    "SUMMARIZATION_MODEL": "facebook/bart-large-cnn",  
    "MAX_INPUT_LENGTH": 1000,  
    "MAX_SUMMARY_INPUT_LENGTH": 10000,  
    "RATE_LIMIT": "100 per day",  
    "DEBUG": os.getenv("FLASK_DEBUG", "False") == "True"
}


logging.basicConfig(level=logging.INFO if not CONFIG["DEBUG"] else logging.DEBUG)
logger = logging.getLogger(__name__)


try:
    sentiment_tokenizer = AutoTokenizer.from_pretrained(CONFIG["SENTIMENT_MODEL"])
    sentiment_model = AutoModelForSequenceClassification.from_pretrained(CONFIG["SENTIMENT_MODEL"])
    sentiment_pipeline = pipeline(
        "sentiment-analysis",
        model=sentiment_model,
        tokenizer=sentiment_tokenizer,
        truncation=True
    )
    summary_pipeline = None
    
    logger.info("Models loaded successfully")
except Exception as e:
    logger.error(f"Error loading models: {str(e)}")
    sentiment_pipeline = None
    summary_pipeline = None

def get_summary_pipeline():
    """Lazy loader for summarization pipeline to save memory"""
    global summary_pipeline
    if summary_pipeline is None:
        logger.info("Loading summarization model...")
        summary_pipeline = pipeline(
            "summarization",
            model=CONFIG["SUMMARIZATION_MODEL"],
            truncation=True
        )
    return summary_pipeline

def validate_input(text: str, max_length: int) -> Optional[str]:
    """Validate input text"""
    if not text or not isinstance(text, str):
        return "Input must be a non-empty string"
    if len(text) > max_length:
        return f"Input too long (max {max_length} characters)"
    return None

def api_response(func):
    """Decorator for consistent API responses"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.error(f"Error in {func.__name__}: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500
    return wrapper

@app.route("/analyze", methods=["POST"])
@api_response
def analyze_sentiment():
    """Analyze sentiment of provided text"""
    if sentiment_pipeline is None:
        return jsonify({"error": "Service unavailable"}), 503
        
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    text = data.get("text", "")
    if error := validate_input(text, CONFIG["MAX_INPUT_LENGTH"]):
        return jsonify({"error": error}), 400

    try:
        result = sentiment_pipeline(text, truncation=True)[0]
        return jsonify({
            "label": result["label"],
            "score": float(result["score"]),  # Convert to float for JSON serialization
            "model": CONFIG["SENTIMENT_MODEL"]
        })
    except Exception as e:
        logger.error(f"Sentiment analysis failed: {str(e)}")
        return jsonify({"error": "Sentiment analysis failed"}), 500

@app.route("/weekly-summary", methods=["POST"])
@api_response
def summarize_feedback():
    """Generate summary from multiple feedback texts"""
    if summary_pipeline is None and get_summary_pipeline() is None:
        return jsonify({"error": "Service unavailable"}), 503
        
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    feedback_list = data.get("feedbacks", [])
    if not isinstance(feedback_list, list):
        return jsonify({"error": "Feedbacks must be provided as a list"}), 400
        
    if len(feedback_list) == 0:
        return jsonify({"error": "Empty feedback list"}), 400
        
    for i, feedback in enumerate(feedback_list):
        if not isinstance(feedback, str):
            return jsonify({"error": f"Feedback at position {i} is not a string"}), 400
            
    combined_text = " ".join(feedback_list)
    if len(combined_text) > CONFIG["MAX_SUMMARY_INPUT_LENGTH"]:
        return jsonify({
            "error": f"Combined feedback too long (max {CONFIG['MAX_SUMMARY_INPUT_LENGTH']} characters)"
        }), 400

    try:
        summary = get_summary_pipeline()(
            combined_text,
            max_length=100,
            min_length=30,
            do_sample=False
        )[0]["summary_text"]
        
        return jsonify({
            "summary": summary,
            "model": CONFIG["SUMMARIZATION_MODEL"],
            "input_feedbacks": len(feedback_list),
            "input_length": len(combined_text)
        })
    except Exception as e:
        logger.error(f"Summarization failed: {str(e)}")
        return jsonify({"error": "Summarization failed"}), 500

@app.route("/health")
def health_check():
    """Health check endpoint"""
    status = {
        "status": "OK" if sentiment_pipeline is not None else "ERROR",
        "models": {
            "sentiment": CONFIG["SENTIMENT_MODEL"],
            "summarization": CONFIG["SUMMARIZATION_MODEL"]
        }
    }
    return jsonify(status)

if __name__ == "__main__":
    app.run(debug=CONFIG["DEBUG"], host="0.0.0.0", port=5000)