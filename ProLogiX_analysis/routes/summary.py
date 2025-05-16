from flask import Blueprint, request, jsonify
\
import logging
from routes.weekly_sentiment import api_response

from config import CONFIG
from model import get_summary_pipeline

summary_blueprint = Blueprint("summary", __name__)
logger = logging.getLogger(__name__)

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
        summary = summary_pipeline(
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
