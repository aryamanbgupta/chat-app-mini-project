import logo from './logo.svg';
import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import './App.css';

function App() {
  const [user, setUser] = useState({});

  function handleGoogleLogin(response) {
    console.log('Encoded JWT ID token: ' + response.credential);
    const userObject = jwt_decode(response.credential);
    console.log(userObject);
    setUser(userObject);
  }

  function handleGoogleLogout() {
    setUser({});
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "850002868075-riog8tkerkj6rm9p4981v1c208i7fi64.apps.googleusercontent.com", // Replace with your actual client ID
      callback: handleGoogleLogin,
    });

    google.accounts.id.renderButton(document.getElementById('signInDiv'), {
      theme: 'outline',
      size: 'large',
    });

    google.accounts.id.prompt();
  }, []);

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
    </div>
  );
}

export default App;
