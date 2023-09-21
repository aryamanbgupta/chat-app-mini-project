from flask import Flask, request, jsonify
from textblob import TextBlob

app = Flask(__name__)

# Dummy storage for user accounts and messages (replace with a database in a real application)
users = {'alice@example.com': 'Alice', 'bob@example.com': 'Bob'}
messages = []

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
