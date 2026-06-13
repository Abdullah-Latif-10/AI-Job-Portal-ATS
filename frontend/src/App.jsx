import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    // Fetch data from the backend server
    axios.get('http://localhost:5000/api/message')
      .then(response => {
        setMessage(response.data.text);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setMessage('Failed to connect to backend.');
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      <h1>MERN Stack Connection Test</h1>
      <div style={{ padding: '20px', border: '1px solid #ccc', display: 'inline-block', borderRadius: '8px' }}>
        <h3>Backend Status:</h3>
        <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>
      </div>
    </div>
  );
}

export default App;