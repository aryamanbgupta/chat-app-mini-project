import pytest
from server import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

'''def test_login_with_google(client):
    # Test a successful Google login
    response = client.post('/login-with-google', json={'google_id_token': 'valid_token'})
    assert response.status_code == 200
    data = response.get_json()
    assert 'user_name' in data

    # Test an invalid Google login
    response = client.post('/login-with-google', json={'google_id_token': 'invalid_token'})
    assert response.status_code == 200
    data = response.get_json()
    assert 'user_name' not in data
'''
def test_send_message(client):
    # Test sending a message
    response = client.post(
        '/send-message',
        json={'sender': 'user1@example.com', 'recipient': 'user2@example.com', 'message': 'Hello, user2!'}
    )
    assert response.status_code == 200
    data = response.get_json()
    assert data['message'] == 'Message sent successfully'

def test_get_messages(client):
    # Test retrieving messages between two users
    response = client.get('/get-messages/user1@example.com/user2@example.com')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data['messages'], list)

def test_get_inbox(client):
    # Test retrieving inbox messages for a user
    response = client.get('/get-inbox/user1@example.com')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data['inbox'], list)

def test_get_recipients(client):
    # Test searching for recipients
    response = client.get('/get-recipients/user')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data['recipients'], list)

if __name__ == '__main__':
    pytest.main()
