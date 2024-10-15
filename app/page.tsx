"use client";
import React, { useEffect, useState } from 'react';
import { handleOAuthToken } from './api/oauth/oauth';
import { initWebSocket } from './api/websocket/websocket';
import './styles/fonts.css';

const HomePage: React.FC = () => {
    const [isAuth, setIsAuth] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const handleMouseDown = () => {
        setIsPressed(true);
    };

    const handleMouseUp = () => {
        setIsPressed(false);
    };

    const handleMouseLeave = () => {
        setIsPressed(false);
    };

    const clickedImg = '/images/button-clicked.png';
    const unclickedImg = '/images/button-unclicked.png';

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
    };

    useEffect(() => {
        const fragment = new URLSearchParams(window.location.hash.slice(1));
        const accessToken = fragment.get('access_token');
        
        if (accessToken) {
            handleOAuthToken(fragment);
            setIsAuth(true);
            initWebSocket(setIsConnected);
        }
    }, []);

    return (
        <div className="h-screen flex justify-center items-center bg-gags-pattern bg-repeat">
            {/* If user is not authenticated, show the authentication modal */}
            {!isAuth && (
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    <div className="bg-white p-10 rounded-lg shadow-lg text-center border border-gray-300"> {/* Added border classes */}
                        <h2 className="text-2xl font-semibold font-minnie text-gray-800 mb-6">Connect to Discord</h2>
                        <p className="text-xl text-gray-600 font-impress">ToonScout needs a Discord connection to function.</p>
                        <p className="text-xl text-gray-600 font-impress">Click the button below to begin!</p>
                        <br />
                        <button
                            id="login"
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseLeave}
                            onClick={initiateOAuth}
                            className="relative flex justify-center items-center w-16 h-16 mx-auto"
                            style={{
                                backgroundImage: `url(${isPressed ? clickedImg : unclickedImg})`,
                                backgroundSize: 'contain',
                                backgroundPosition: 'center', // Center the image
                                cursor: 'pointer', // Change cursor to pointer for better UX
                            }}
                        >
                        </button>
                    </div>
                </div>
            )}

            {/* If user is authenticated, show the second box */}
            {isAuth && !isConnected && (
                <div className="fixed inset-0 flex justify-center items-center bg-gags-pattern bg-repeat">
                    <div className="bg-white p-10 rounded-lg shadow-lg text-center space-y-6 border border-gray-300">
                        <h2 className="text-3xl font-semibold font-minnie text-gray-800 mb-4">Final steps...</h2>
                        {/* Step 1 */}
                        <div className="bg-gray-100 p-6 rounded-lg shadow-md border border-gray-300">
                            <h2 className="text-xl font-semibold font-minnie text-gray-800 mb-4">Enable Companion App Support</h2>
                            <img src='/images/gameplay-menu.png' alt='Gameplay menu' className="mx-auto" />
                        </div>

                        {/* Step 2 */}
                        <div className="bg-gray-100 p-6 rounded-lg shadow-md border border-gray-300">
                            <h2 className="text-xl font-semibold font-minnie text-gray-800 mb-4">Click "OK" on in-game popup</h2>
                            <img src='' alt='Step 2 Image' className="mx-auto" />
                        </div>
                    </div>
                </div>
            )}

            {/* If user is authenticated and connected, show home screen */}
            {isAuth && isConnected && (
                <div className="fixed inset-0 flex justify-center items-center bg-gags-pattern bg-repeat">
                    <div className="bg-white p-10 rounded-lg shadow-lg text-center border border-gray-300">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to ToonScout!</h2>
                        <p className="text-lg text-gray-600">To connect, follow the steps below.</p>
                    </div>
                </div>
            )}
        </div>
    );
};


export default HomePage;