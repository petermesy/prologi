import re
from datetime import datetime
from typing import Dict, List, Optional, Union
from flask import jsonify

def validate_date(date_string: str, format: str = "%Y-%m-%d") -> bool:
    """Validate if a string is a valid date in the specified format."""
    try:
        datetime.strptime(date_string, format)
        return True
    except ValueError:
        return False

def truncate_text(text: str, max_length: int) -> str:
    """Safely truncate text to a maximum length without breaking words."""
    if len(text) <= max_length:
        return text
    return text[:max_length].rsplit(' ', 1)[0] + "..."

def clean_text(text: str) -> str:
    """Basic text cleaning for NLP input."""
    if not isinstance(text, str):
        raise ValueError("Input must be a string")
    
    # Remove excessive whitespace and special characters
    text = re.sub(r'\s+', ' ', text).strip()
    text = re.sub(r'[^\w\s.,!?]', '', text)
    return text

def format_api_response(
    success: bool = True,
    data: Optional[Union[Dict, List]] = None,
    message: Optional[str] = None,
    status_code: int = 200,
    **additional_fields
) -> tuple:
    """Standardized API response formatter."""
    response = {
        "success": success,
        "timestamp": datetime.utcnow().isoformat(),
        **additional_fields
    }
    
    if data is not None:
        response["data"] = data
    
    if message:
        response["message"] = message
    
    return jsonify(response), status_code

def validate_feedback_structure(feedback: Dict) -> List[str]:
    """Validate the structure of a feedback item and return error messages."""
    errors = []
    
    if not isinstance(feedback, dict):
        return ["Feedback must be a dictionary"]
    
    if 'text' not in feedback:
        errors.append("Missing 'text' field")
    elif not isinstance(feedback['text'], str) or not feedback['text'].strip():
        errors.append("'text' must be a non-empty string")
    
    if 'date' not in feedback:
        errors.append("Missing 'date' field")
    elif not validate_date(feedback['date']):
        errors.append("'date' must be in YYYY-MM-DD format")
    
    return errors

def group_feedbacks_by_date(feedbacks: List[Dict]) -> Dict[str, List[str]]:
    """Group feedback texts by their date."""
    grouped = {}
    for fb in feedbacks:
        date = fb['date']
        if date not in grouped:
            grouped[date] = []
        grouped[date].append(fb['text'])
    return grouped

def calculate_text_stats(text: str) -> Dict[str, int]:
    """Calculate basic statistics about a text."""
    words = text.split()
    sentences = re.split(r'[.!?]', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    return {
        "char_count": len(text),
        "word_count": len(words),
        "sentence_count": len(sentences),
        "avg_word_length": round(sum(len(word) for word in words) / len(words), 2) if words else 0
    }