from flask import Flask
from flask_cors import CORS
from config import CONFIG
from routes.summary import summary_blueprint
# from routes.sentiment import sentiment_blueprint

app = Flask(__name__)
CORS(app)

app.register_blueprint(summary_blueprint)
# app.register_blueprint(sentiment_blueprint)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
    