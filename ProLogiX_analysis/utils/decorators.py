from functools import wraps
from flask import jsonify
import logging

logger = logging.getLogger(__name__)

def api_response(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.exception(f"Error in {func.__name__}")
            return jsonify({
                "error": "Internal server error",
                "details": str(e)
            }), 500
    return wrapper

def validate_json(schema):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            # Implement JSON validation logic here
            return f(*args, **kwargs)
        return wrapper
    return decorator