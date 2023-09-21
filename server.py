from flask import Flask, request, jsonify
from textblob import TextBlob
from google.oauth2 import id_token
from google.auth.transport import requests
from flask_cors import CORS  # Add CORS for cross-origin requests
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests


# Dummy storage for user accounts and messages (replace with a database in a real application)
users = {}
messages = []

CLIENT_ID = '850002868075-riog8tkerkj6rm9p4981v1c208i7fi64.apps.googleusercontent.com'  

@app.route('/login-with-google', methods=['POST'])
def login_with_google():
    data = request.get_json()

    # Extract the Google ID token from the request
    google_id_token = data['google_id_token']

    # Verify the Google ID token
    user_info = verify_google_id_token(google_id_token)

    if user_info:
        email = user_info['email']
        user_name = user_info['name']

        # Store or retrieve user information in your application's storage (e.g., database)
        users[email] = user_name

        return jsonify({'message': 'Google login successful', 'user_name': user_name})
    else:
        return jsonify({'message': 'Google login failed'})

def verify_google_id_token(id_token):
    try:
        id_info = id_token.verify_oauth2_token(id_token, requests.Request(), CLIENT_ID)
        return {
            'email': id_info['email'],
            'name': id_info['name']
        }
    except Exception as e:
        return None

@app.route('/send-message', methods=['POST'])
def send_message():
    data = request.get_json()

    sender = data['sender']
    recipient = data['recipient']
    message_content = data['message']

    # Perform sentiment analysis
    sentiment = analyze_sentiment(message_content)

    # Create a message JSON object
    message = {
        'sender': sender,
        'recipient': recipient,
        'message': message_content,
        'sentiment': sentiment
    }

    # Store the message (in-memory storage, replace with a database)
    messages.append(message)

    return jsonify({'message': 'Message sent successfully'})

@app.route('/get-messages/<sender>/<recipient>', methods=['GET'])
def get_messages(sender, recipient):
    # Filter messages based on sender and recipient
    filtered_messages = [message for message in messages if
                         message['sender'] == sender and message['recipient'] == recipient]
    return jsonify({'messages': filtered_messages})

def analyze_sentiment(text):
    blob = TextBlob(text)
    sentiment = blob.sentiment
    return {'polarity': sentiment.polarity, 'subjectivity': sentiment.subjectivity}

if __name__ == '__main__':
    app.run(debug=True)
