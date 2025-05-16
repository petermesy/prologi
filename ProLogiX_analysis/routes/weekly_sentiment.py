from flask import Blueprint, request, jsonify
from collections import defaultdict
from datetime import datetime
from models.nlp_models import ModelManager
from utils.decorators import api_response
from config import CONFIG

weekly_summary_blueprint = Blueprint('weekly_summary', __name__)
model_manager = ModelManager()

@weekly_summary_blueprint.route('/weekly-summary', methods=['POST'])
@api_response
def generate_weekly_summary():
    data = request.get_json()
    
    # Validation
    if not data or 'feedbacks' not in data:
        return jsonify({"error": "Feedbacks array is required"}), 400
    
    feedbacks = data['feedbacks']
    if not isinstance(feedbacks, list):
        return jsonify({"error": "Feedbacks must be an array"}), 400
    
    # Group feedbacks by date
    daily_feedbacks = defaultdict(list)
    for idx, fb in enumerate(feedbacks):
        if not isinstance(fb, dict) or 'text' not in fb or 'date' not in fb:
            return jsonify({
                "error": f"Feedback at index {idx} must have 'text' and 'date' fields"
            }), 400
        
        try:
            date = datetime.strptime(fb['date'], "%Y-%m-%d").date()
            daily_feedbacks[date.isoformat()].append(fb['text'])
        except ValueError:
            return jsonify({
                "error": f"Invalid date format at index {idx}. Use YYYY-MM-DD."
            }), 400
    
    # Generate summaries
    summaries = []
    pipeline = model_manager.get_summary_pipeline()
    
    for date, texts in daily_feedbacks.items():
        combined_text = " ".join(texts)
        
        if len(combined_text) > CONFIG.MAX_SUMMARY_INPUT_LENGTH:
            return jsonify({
                "error": f"Combined feedback for {date} exceeds maximum length"
            }), 400
        
        summary = pipeline(
            combined_text,
            max_length=CONFIG.MAX_SUMMARY_LENGTH,
            min_length=CONFIG.MIN_SUMMARY_LENGTH,
            do_sample=False
        )[0]["summary_text"]
        
        summaries.append({
            "date": date,
            "summary": summary,
            "feedback_count": len(texts)
        })
    
    return jsonify({
        "summaries": sorted(summaries, key=lambda x: x['date']),
        "model": CONFIG.SUMMARIZATION_MODEL
    })