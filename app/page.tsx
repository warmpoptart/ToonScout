"use client";
import React, { useEffect } from 'react';
import { handleOAuthToken } from './api/oauth/oauth';

const HomePage: React.FC = () => {
    const initiateOAuth = () => {
        const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
        const redirectUri = encodeURIComponent('https://scouttoon.info/');
        const scope = encodeURIComponent('identify');
        const url = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scope}`;
        
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