"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation'
import './Home.css';
import './App.css';

function Home() {
  const router = useRouter();
  const [yourUsername, setYourUsername] = useState('');
  const [theirUsername, setTheirUsername] = useState('');

  return (
    <div className="App">
      <div className="home-container">
        <h2 className="headline-text">See what you have in common with other Farcaster users</h2>
        <div className='input-field'>
          <input
            type="text"
            value={yourUsername}
            onChange={(e) => setYourUsername(e.target.value)}
            placeholder="Your Username"
          />
        </div>
        <div className='input-field'>
          <input
            type="text"
            value={theirUsername}
            onChange={(e) => setTheirUsername(e.target.value)}
            placeholder="Their Username"
          />
        </div>
        <button className='home-button' type="submit" onClick={()=>router.push(`/profile?username1=${yourUsername.toLowerCase()}&username2=${theirUsername.toLowerCase()}`)}>Go</button>
      </div>
    </div>
  );
}

export default Home;