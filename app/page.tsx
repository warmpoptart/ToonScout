"use client";
import React, { useEffect, useState } from 'react';
import { handleOAuthToken } from './api/oauth/oauth';
import { initWebSocket } from './api/websocket/websocket';
import './styles/fonts.css';
import Auth from './components/Auth';
import GameSteps from './components/GameSteps';
import Home from './components/Home';

const HomePage: React.FC = () => {
    const [isAuth, setIsAuth] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => setIsPressed(false);

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
        // const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
        // const redirectUri = encodeURIComponent('https://scouttoon.info/');
        // const scope = encodeURIComponent('identify');

        // const randomState = generateRandomString();
        // localStorage.setItem('oauth-state', randomState);

        // const url = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scope}&state=${btoa(randomState)}`;
        
        // // Redirect to Discord authorization URL
        // window.location.href = url;
        setIsAuth(true);
        setIsConnected(true);
    };

    useEffect(() => {
        const fragment = new URLSearchParams(window.location.hash.slice(1));
        const accessToken = fragment.get('access_token');
        
        if (accessToken) {
            handleOAuthToken(fragment).then((id) => {
                setIsAuth(true);
                if (id) {
                    initWebSocket(setIsConnected, id)
                } else {
                    console.log("ID error");
                }
            });
        }
    }, []);

    return (
        <div className="flex flex-col h-screen bg-gags-pattern bg-repeat overflow-y-auto">
            {/* Authentication */}
            {!isAuth && (
            <Auth
                initiateOAuth={initiateOAuth}
                handleMouseDown={handleMouseDown}
                handleMouseUp={handleMouseUp}
                handleMouseLeave={handleMouseLeave}
                isPressed={isPressed}
            />
            )}
        
            {/* Connecting Steps */}
            {isAuth && !isConnected && <GameSteps />}
        
            {/* Home Screen */}
            {isAuth && isConnected && <Home />}
        </div>
    );
};      

export default HomePage;