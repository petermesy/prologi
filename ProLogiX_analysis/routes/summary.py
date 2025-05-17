# routes/summary.py
from flask import Blueprint, request, jsonify
from collections import defaultdict
from datetime import datetime
from functools import wraps
import logging
from typing import Dict

from config import CONFIG
from model import get_summary_pipeline, get_sentiment_pipeline


summary_blueprint = Blueprint("summary", __name__)
logger = logging.getLogger(__name__)

def api_response(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.error(f"Error in {func.__name__}: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500
    return wrapper
def validate_feedback(feedback: Dict, index: int):
    if not isinstance(feedback, dict):
        raise ValueError(f"Feedback at index {index} is not a dictionary")
    if not isinstance(feedback.get("text"), str):
        raise ValueError(f"Feedback text at index {index} is not a string")
    if not isinstance(feedback.get("date"), str):
        raise ValueError(f"Feedback date at index {index} is not a string")
    try:
        datetime.strptime(feedback["date"], "%Y-%m-%d").date()
    except ValueError:
        raise ValueError(f"Invalid date format at index {index}. Use YYYY-MM-DD.")

@summary_blueprint.route("/summarize-feedback", methods=["POST"])
@api_response
def summarize_feedback():
    summary_pipeline = get_summary_pipeline()
    if summary_pipeline is None:
        return jsonify({"error": "Service unavailable"}), 503

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    feedback_list = data.get("feedbacks", [])
    if not isinstance(feedback_list, list) or not feedback_list:
        return jsonify({"error": "Invalid or empty feedback list"}), 400

    for i, fb in enumerate(feedback_list):
        if not isinstance(fb, str):
            return jsonify({"error": f"Feedback at index {i} is not a string"}), 400

    combined_text = " ".join(feedback_list)
    if len(combined_text) > CONFIG["MAX_SUMMARY_INPUT_LENGTH"]:
        return jsonify({
            "error": f"Combined feedback too long (max {CONFIG['MAX_SUMMARY_INPUT_LENGTH']} characters)"
        }), 400

    try:
        input_length = len(combined_text.split())
        max_len = min(100, max(30, int(input_length * 0.7)))

        summary = summary_pipeline(
            combined_text,
            max_length=max_len,
            min_length=min(30, max_len - 1),
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




@summary_blueprint.route("/weekly-sentiment", methods=["POST"])
@api_response
def weekly_sentiment_report():
    sentiment_pipeline = get_sentiment_pipeline()
    if sentiment_pipeline is None:
        return jsonify({"error": "Service unavailable"}), 503

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    feedback_list = data.get("feedbacks", [])
    if not isinstance(feedback_list, list) or not feedback_list:
        return jsonify({"error": "Invalid or empty feedback list"}), 400

    grouped = defaultdict(list)
    for i, fb in enumerate(feedback_list):
        try:
            validate_feedback(fb, i)
            date_key = datetime.strptime(fb["date"], "%Y-%m-%d").date().isoformat()
            grouped[date_key].append(fb["text"])
        except ValueError as ve:
            return jsonify({"error": str(ve)}), 400

    sentiment_counts = {}
    for date, texts in grouped.items():
        sentiments = sentiment_pipeline(texts)
        pos = sum(1 for s in sentiments if s['label'] == 'POSITIVE')
        neg = sum(1 for s in sentiments if s['label'] == 'NEGATIVE')
        sentiment_counts[date] = {"positive": pos, "negative": neg, "total": len(texts)}

    return jsonify({
        "sentiment_report": sentiment_counts,
        "model": CONFIG["SENTIMENT_MODEL"]
    })