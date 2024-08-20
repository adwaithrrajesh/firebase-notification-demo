import React, { useEffect } from 'react';
import { requestForToken, onMessageListener } from './firebase';

function App() {
  useEffect(() => {
    requestForToken();
  }, []);

  useEffect(() => {
    onMessageListener()
      .then(payload => {
        console.log('Received foreground message: ', payload);
      })
      .catch(err => console.log('Failed to receive foreground message: ', err));
  }, []);

  return (
    <div className="App">
      <h1>React Vite Firebase Cloud Messaging</h1>
      <button onClick={requestForToken}>Request Notification Permission</button>
    </div>
  );
}

export default App;
