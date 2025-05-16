from flask import Flask
from flask_cors import CORS
from config import CONFIG
from routes import sentiment_blueprint, summary_blueprint, weekly_summary_blueprint

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Register blueprints
    app.register_blueprint(sentiment_blueprint)
    app.register_blueprint(summary_blueprint)
    app.register_blueprint(weekly_summary_blueprint)
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=CONFIG["DEBUG"], host="0.0.0.0", port=5000)