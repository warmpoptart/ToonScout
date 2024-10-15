"use client";
import React, { useEffect, useState } from 'react';
import { handleOAuthToken } from './api/oauth/oauth';

const HomePage: React.FC = () => {
    const generateRandomString = (length = 16) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    };
    
    const initiateOAuth = () => {
        const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
        const redirectUri = encodeURIComponent('https://scouttoon.info/');
        const scope = encodeURIComponent('identify');

        const randomState = generateRandomString();
        localStorage.setItem('oauth-state', randomState);

        const url = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scope}&state=${btoa(randomState)}`;
        
        // Redirect to Discord authorization URL
        window.location.href = url;
    };

    useEffect(() => {
        const fragment = new URLSearchParams(window.location.hash.slice(1));
        const accessToken = fragment.get('access_token');
        
        if (accessToken) {
            handleOAuthToken(fragment);
        }
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <button
                id="login"
                onClick={initiateOAuth}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#7289DA',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    cursor: 'pointer',
                }}
            >
                Authenticate
            </button>
        </div>
    );
};

export default HomePage;