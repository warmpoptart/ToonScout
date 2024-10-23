"use client";
import React, { useEffect, useState } from 'react';
import { handleOAuthToken } from './api/oauth';
import { initWebSocket } from './api/websocket';
import './styles/fonts.css';
import Auth from './components/Auth';
import GameSteps from './components/GameSteps';
import Home from './components/Home';

const HomePage: React.FC = () => {
    const [isAuth, setIsAuth] = useState(true);
    const [isConnected, setIsConnected] = useState(false);

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
            {!isAuth && <Auth />}
        
            {/* Connecting Steps */}
            {isAuth && !isConnected && <GameSteps />}
        
            {/* Home Screen */}
            {isAuth && isConnected && <Home />}
        </div>
    );
};      

export default HomePage;