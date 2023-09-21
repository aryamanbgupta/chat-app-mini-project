import requests

SERVER_URL = 'http://localhost:5000'  # Update with your server's URL

def main():
    while True:
        print("1. Search for a user")
        print("2. Exit")
        choice = input("Enter your choice: ")

        if choice == '1':
            recipient_email = input("Enter recipient's email address: ")

            if recipient_email in users:
                send_message(recipient_email)
            else:
                print("Recipient not found. Please try again.")
        elif choice == '2':
            break
        else:
            print("Invalid choice. Please try again.")

def send_message(recipient_email):
    sender_email = input("Enter your email address: ")
    message = input("Enter your message: ")

    data = {
        'sender': sender_email,
        'recipient': recipient_email,
        'message': message
    }

    response = requests.post(f'{SERVER_URL}/send-message', json=data)

    if response.status_code == 200:
        print("Message sent successfully.")
    else:
        print("Failed to send message. Please try again.")

if __name__ == '__main__':
    main()
