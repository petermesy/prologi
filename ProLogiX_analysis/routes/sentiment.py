# # routes/sentiment.py
# from flask import Blueprint, request, jsonify
# from functools import wraps
# import logging
# from config import CONFIG
# from model import get_sentiment_pipeline

# sentiment_blueprint = Blueprint("sentiment", __name__)
# logger = logging.getLogger(__name__)

# def api_response(func):
#     @wraps(func)
#     def wrapper(*args, **kwargs):
#         try:
#             return func(*args, **kwargs)
#         except Exception as e:
#             logger.error(f"Error in {func.__name__}: {str(e)}")
#             return jsonify({"error": "Internal server error"}), 500
#     return wrapper

# @sentiment_blueprint.route("/sentiment", methods=["POST"])
# @api_response
# def analyze_sentiment():
#     sentiment_pipeline = get_sentiment_pipeline()
#     if sentiment_pipeline is None:
#         return jsonify({"error": "Service unavailable"}), 503

#     data = request.get_json()
#     if not data:
#         return jsonify({"error": "No data provided"}), 400

#     text = data.get("text", "")
#     if not isinstance(text, str) or not text:
#         return jsonify({"error": "Input must be a non-empty string"}), 400

#     if len(text) > CONFIG["MAX_INPUT_LENGTH"]:
#         return jsonify({"error": f"Input too long (max {CONFIG['MAX_INPUT_LENGTH']} characters)"}), 400

#     try:
#         result = sentiment_pipeline(text)[0]
#         return jsonify({
#             "label": result["label"],
#             "score": float(result["score"]),
#             "model": CONFIG["SENTIMENT_MODEL"]
#         })
#     except Exception as e:
#         logger.error(f"Sentiment analysis failed: {str(e)}")
#         return jsonify({"error": "Sentiment analysis failed"}), 500


# # curl -X POST http://localhost:5000/sentiment \
# #   -H "Content-Type: application/json" \
# #   -d '{"text": "I really love this product! It'\''s amazing and exceeded my expectations."}'


