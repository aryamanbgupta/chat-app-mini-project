import logo from './logo.svg';
import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import './App.css';

function App() {
  const [user, setUser] = useState({});
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sentMessages, setSentMessages] = useState([]);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [possibleRecipients, setPossibleRecipients] = useState([]);

  function handleGoogleLogin(response) {
    const userObject = jwt_decode(response.credential);
    setUser(userObject);
  }

  function handleGoogleLogout() {
    setUser({});
  }
  /*
  function sendMessage() {
    if (!recipientEmail || !message) {
      alert('Recipient and message are required fields.');
      return;
    }

    // Send the message to the server
    fetch('http://localhost:5000/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: user.email,
        recipient: recipientEmail,
        message: message,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Message sent successfully') {
          // Update the sent messages
          setSentMessages([...sentMessages, { sender: user.email, recipient: recipientEmail, message }]);
          setMessage('');
        } else {
          alert('Failed to send message. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error while sending the message:', error);
      });
  }
  */
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "850002868075-riog8tkerkj6rm9p4981v1c208i7fi64.apps.googleusercontent.com",
      callback: handleGoogleLogin,
    });

    google.accounts.id.renderButton(document.getElementById('signInDiv'), {
      theme: 'outline',
      size: 'large',
    });

    google.accounts.id.prompt();
  }, []);

  useEffect(() => {
    // Fetch inbox messages when the user logs in
    if (user.email) {
      fetch(`http://localhost:5000/get-inbox/${user.email}`)
        .then((response) => response.json())
        .then((data) => {
          setInboxMessages(data.inbox);
          console.log(possibleRecipients);
        })
        .catch((error) => {
          console.error('Error fetching inbox messages:', error);
        });
    }
  }, [user.email]);

  useEffect(() => {
    // Fetch possible recipients as the user types
    if (recipientEmail) {
      fetch(`http://localhost:5000/get-recipients/${recipientEmail}`)
        .then((response) => response.json())
        .then((data) => {
          setPossibleRecipients(data.recipients);
        })
        .catch((error) => {
          console.error('Error fetching possible recipients:', error);
        });
    }
  }, [recipientEmail]);

  function sendMessage() {
    if (!recipientEmail || !message) {
      alert('Recipient and message are required fields.');
      return;
    }

    // Send the message to the server
    fetch('http://localhost:5000/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: user.email,
        recipient: recipientEmail,
        message: message,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Message sent successfully') {
          // Update the sent messages
          setSentMessages([...sentMessages, { sender: user.email, recipient: recipientEmail, message }]);
          setMessage('');

          // Update the inbox messages (grouped by recipients)
          setInboxMessages((prevInboxMessages) => {
            const updatedInbox = { ...prevInboxMessages };
        
            // Initialize an empty array for the recipient if it doesn't exist
            if (!updatedInbox[recipientEmail]) {
              updatedInbox[recipientEmail] = [];
            }
            
            // Add the new message to the recipient's inbox
            updatedInbox[recipientEmail].push({ sender: user.email, recipient: recipientEmail, message });
        
            return updatedInbox;
          });
        } else {
          alert('Failed to send message. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error while sending the message:', error);
      });
  }

  return (
    <div className="App">
      <div id="signInDiv"></div>
      {user.email && (
        <div>
          <button onClick={handleGoogleLogout}>Sign Out</button>
          <img src={user.picture} alt="User" />
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      )}

      <div>
        <h2>Send a Message</h2>
        <input
          type="text"
          placeholder="Recipient Email"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
        />

        {/* Display the list of possible recipients */}
        {possibleRecipients.length > 0 && (
          <ul>
            {possibleRecipients.map((recipient, index) => (
              <li key={index}>
                <button onClick={() => setRecipientEmail(recipient)}>{recipient}</button>
              </li>
            ))}
          </ul>
        )}

        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button onClick={sendMessage}>Send</button>
      </div>

      {Object.keys(inboxMessages).length > 0 && (
      <div>
        <h2>Inbox</h2>
        {Object.keys(inboxMessages).map((recipientEmail) => {
          const recipientMessages = inboxMessages[recipientEmail];
          if (recipientMessages.length > 0) {
            return (
              <div key={recipientEmail}>
                <h3>Recipient: {recipientEmail}</h3>
                <ul>
                  {recipientMessages.map((inboxMessage, index) => (
                    <li key={index}>
                      <strong>Sender: {inboxMessage.sender}</strong>
                      <p>{inboxMessage.message}</p>
                      {inboxMessage.sentiment && ( // Add a check for sentiment
                        <p>
                          Sentiment: Polarity - {inboxMessage.sentiment.polarity}, Subjectivity -{' '}
                          {inboxMessage.sentiment.subjectivity}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          }
          return null; // Skip recipients with no messages
        })}
      </div>
    )}

    </div>
  );
}

export default App;