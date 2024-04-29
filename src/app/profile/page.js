"use client";
import { FarcasterEmbed } from "react-farcaster-embed/dist/client";
import "react-farcaster-embed/dist/styles.css";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'
import './Profile.css';
import '../App.css';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function Profile() {
  const searchParams = useSearchParams()
  const yourUsername = searchParams.get('username1');
  const theirUsername = searchParams.get('username2');

  const [isValidUsers, setIsValidUsers] = useState(false);
  const [ yourProfilePic, setYourProfilePic] = useState('3');
  const [ theirProfilePic, setTheirProfilePic] = useState('2');
  const [ followingSince1, setFollowingSince1] = useState(false);
  const [ followingSince2, setFollowingSince2] = useState(false);
  const [ commonFollowing, setCommonFollowing] = useState([]);
  const [ commonChannels, setCommonChannels] = useState([]);
  const [ yourLikedCasts, setYourLikedCasts] = useState([]);
  const [ theirLikedCasts, setTheirLikedCasts] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if(yourUsername && theirUsername){
      validateUsers();
      if(isValidUsers){
        getProfilePictures();
        getMutualFollowing();
        getCommonChannels();
        getLikes();
        getCommonFollowing();
      }
    }
  }, [isValidUsers]);

  const validateUsers = async () => {
    const response = await fetch(BASE_URL+'/api/validate-users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username1: yourUsername, username2: theirUsername }),
    });
    const data = await response.json();
    console.log(data)
    setIsValidUsers(data.valid)
    setIsLoading(false)
  }

  const getProfilePictures = async () => {
    const response = await fetch(BASE_URL+'/api/profile-pictures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username1: yourUsername, username2: theirUsername }),
      });
      const data = await response.json();
      setYourProfilePic(data.username1)
      setTheirProfilePic(data.username2)
  }

  const getMutualFollowing = async () => {
    const response = await fetch(BASE_URL+'/api/mutual-following', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username1: yourUsername, username2: theirUsername }),
      });
      const data = await response.json();
      console.log(data)
      setFollowingSince1(data.username1);
      setFollowingSince2(data.username2);
      //
  }

  const getCommonChannels = async () => {
    const response = await fetch(BASE_URL+'/api/common-channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username1: yourUsername, username2: theirUsername }),
      });
      const data = await response.json();
      console.log(data)
      setCommonChannels(data)
      //
  }

  const getLikes = async () => {
    const response = await fetch(BASE_URL+'/api/liked-casts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username1: yourUsername, username2: theirUsername }),
      });
      const data = await response.json();
      console.log(data); // handle response
      setYourLikedCasts(data.username1)
      setTheirLikedCasts(data.username2)
      //
  }

  const getCommonFollowing = async () => {
    const response = await fetch(BASE_URL+'/api/common-following', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username1: yourUsername, username2: theirUsername }),
    });
    const data = await response.json();
    setCommonFollowing(data)
    // console.log(data); // You can handle the response data as needed
  }

  const formatTime = (timeStamp) => {
    return new Date(timeStamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }); 
  }

  if (!yourUsername || !theirUsername) {
    return ProfileDataError();
  }
  
  if(isLoading){
    return <div className='summary-error'>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <h1>Loading...</h1>
      </div>
      </div>
  }
  
  if(!isValidUsers){
    return <div className='summary-error'>
      {ProfileDataError()}
    </div>
  }

  return (
    <div className='App'>
    <div className='summary'>
      <div className="section-container">
        <div className='profile-pic-container'>
            <img className='profile-pic your-pic' src={yourProfilePic} alt="Your Profile" />
            <img className='profile-pic their-pic' src={theirProfilePic} alt="Their Profile" />
        </div>
        <h1 className="names">{theirUsername} and you</h1>
        <div className="following-since">{followingSince1 ? 'Following since ' + formatTime(followingSince1) : 'Not following'}</div>
        {/* <div className="following-since">{followingSince2 ? `${theirUsername} following you since ` + formatTime(followingSince2) : `${theirUsername} is not following you `}</div> */}
      </div>
      <div className="section-container">
        <h2>Channels you're both in</h2>
        <div className='channel-container'>
            {commonChannels.map(channel => (
            <a href={channel.url} className='channel-item' key={channel.name} style={{ textDecoration: 'none', color: 'inherit' }}>
        
                <span className='channel-name'>{channel.name}</span>
                <img className='channel-pic' src={channel.imageUrl} alt={channel.name} />
            </a>
            ))}
        </div>
      </div>
      <div className="section-container">
        <h2>People you both follow</h2>
        <div className='channel-container'>
            {commonFollowing.map(profile => (
            <a href={'https://warpcast.com/'+profile.name} className='channel-item' key={profile.name} style={{ textDecoration: 'none', color: 'inherit' }}>
                <span className='channel-name'>{profile.name}</span>
                <img className='channel-pic' src={profile.image} alt={profile.name} />
            </a>
            ))}
        </div>
      </div>
      <div className="section-container">
        <h2>{theirUsername} casts you liked</h2>
        <div className="cast-embed-container">
            {yourLikedCasts.map(cast => (
            <div className='cast-embed-item'>
                <FarcasterEmbed className='cast-embed' url={cast}/>
            </div>
            ))}
        </div>
      </div>
      <div className="section-container">
        <h2>Your casts {theirUsername} has liked</h2>
        <div className="cast-embed-container">
            {theirLikedCasts.map(cast => (
            <div className='cast-embed-item'>
                <FarcasterEmbed className='cast-embed' url={cast}/>
            </div>
            ))}
        </div>
      </div>    
      </div>
    </div>
  );
}

function ProfileDataError(){
    return (
        <div className='summary-error'>
            <h1>Please enter valid usernames to see a profile</h1>
            <button onClick={() => window.location.href = '/'} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#403a47', color: 'white', border: 'none', borderRadius: '5px', marginTop: '20px' }}>
                Enter Usernames
            </button>
        </div>
    )
}

export default Profile; 