"use client";

import React, { useState, useEffect, Suspense } from 'react';
import './Profile.css';
import '../App.css';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function Meme() {
  const [inputValue, setInputValue] = useState(''); // State to hold the text field value

  const handleButtonClick = async () => {
    console.log('Button clicked with input:', inputValue);
    try {
      const response = await fetch(`/api/getMemes`, {
        method: 'POST', // Changed to POST to send data
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value: inputValue }) // Send the inputValue in the request body
      });
      const data = await response.json();
      console.log('Response from test endpoint:', data);
    } catch (error) {
      console.error('Error fetching from test endpoint:', error);
    }
  }

  return (
      <div className='App'>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // Update state on input change
          placeholder="Enter value"
        />
        <button onClick={handleButtonClick}>Go</button>
      </div>
  );
}

export default Meme; 