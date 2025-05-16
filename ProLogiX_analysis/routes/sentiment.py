from flask import Blueprint, request, jsonify
from models.nlp_models import ModelManager
from utils.decorators import api_response
from config import CONFIG

sentiment_blueprint = Blueprint('sentiment', __name__)
model_manager = ModelManager()

@sentiment_blueprint.route('/sentiment', methods=['POST'])
@api_response
def analyze_sentiment():
    data = request.get_json()
    
    # Validation
    if not data or 'text' not in data:
        return jsonify({"error": "Text field is required"}), 400
    
    text = data['text']
    if not isinstance(text, str) or not text.strip():
        return jsonify({"error": "Text must be a non-empty string"}), 400
    
    if len(text) > CONFIG.MAX_INPUT_LENGTH:
        return jsonify({
            "error": f"Input exceeds maximum length of {CONFIG.MAX_INPUT_LENGTH} characters"
        }), 400
    
    # Processing
    pipeline = model_manager.get_sentiment_pipeline()
    result = pipeline(text)[0]
    
    return jsonify({
        "label": result["label"],
        "score": float(result["score"]),
        "model": CONFIG.SENTIMENT_MODEL
    })