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
        <div className="h-screen flex justify-center items-center bg-gags-pattern bg-repeat overflow-y-auto">
            {/* If user is not authenticated, show the authentication modal */}
            {!isAuth && (
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    <div className="bg-white p-10 rounded-lg shadow-lg text-center border border-gray-300">
                        <h2 className="text-3xl font-semibold font-minnie text-gray-800 mb-6">Connect to Discord</h2>
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
                                backgroundPosition: 'center',
                                cursor: 'pointer',
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
                        <h2 className="text-3xl font-semibold font-minnie text-gray-800 mb-4">Connecting to Toontown Rewritten...</h2>
                        <div className="flex justify-center space-x-8">
                            {/* Step 1 */}
                            <div className="bg-gray-100 p-6 rounded-lg shadow-md border border-gray-300">
                                <h2 className="text-2xl font-semibold font-minnie text-gray-800 mb-4">1. Enable Companion App Support</h2>
                                <img src='/images/gameplay-menu.png' alt='Gameplay menu' className="mx-auto" />
                            </div>

                            {/* Step 2 */}
                            <div className="bg-gray-100 p-6 rounded-lg shadow-md border border-gray-300">
                                <h2 className="text-2xl font-semibold font-minnie text-gray-800 mb-12">2. Click "OK" on in-game popup</h2>
                                <img src='/images/prompt.png' alt='Prompt' className="mx-auto" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* If user is authenticated and connected, show home screen */}
            {isAuth && isConnected && (
                <div className="relative h-screen overflow-hidden">
                    <div className="bg-white p-6 md:p-10 rounded-lg shadow-lg text-center border border-gray-300 w-full max-w-6xl mx-auto space-y-6 md:space-y-8 mt-10 overflow-y-auto">
                        <h2 className="text-3xl font-semibold font-minnie text-gray-800 mb-4">Welcome to ToonScout!</h2>
                        <p className="text-xl text-gray-600 font-impress mb-6">Run these commands anywhere in Discord to get real-time information regarding your toon!</p>

                        {/* Commands Container */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {/* /info command */}
                            <div className="bg-gray-100 p-4 md:p-6 rounded-lg shadow-md border border-gray-300">
                                <h3 className="text-xl font-semibold font-minnie text-gray-800 mb-2 md:mb-4">/info</h3>
                                <p className="text-lg text-gray-600 font-impress mb-2">Displays your toon photo, laff, and location.</p>
                            </div>

                            {/* /fish command */}
                            <div className="bg-blue-100 p-4 md:p-6 rounded-lg shadow-md border border-gray-300">
                                <h3 className="text-xl font-semibold font-minnie text-gray-800 mb-2 md:mb-4">/fish</h3>
                                <p className="text-lg text-gray-600 font-impress mb-2">Provides advising on where to fish or what to catch.</p>
                            </div>

                            {/* /suit command */}
                            <div className="bg-red-100 p-4 md:p-6 rounded-lg shadow-md border border-gray-300">
                                <h3 className="text-xl font-semibold font-minnie text-gray-800 mb-2 md:mb-4">/suit</h3>
                                <p className="text-lg text-gray-600 font-impress mb-2">Get your suit progress and promotion recommendations.</p>
                            </div>

                            {/* /gags command */}
                            <div className="bg-purple-100 p-4 md:p-6 rounded-lg shadow-md border border-gray-300">
                                <h3 className="text-xl font-semibold font-minnie text-gray-800 mb-2 md:mb-4">/gags</h3>
                                <p className="text-lg text-gray-600 font-impress mb-2">Displays current gags and progress.</p>
                            </div>

                            {/* /tasks command */}
                            <div className="bg-green-100 p-4 md:p-6 rounded-lg shadow-md border border-gray-300">
                                <h3 className="text-xl font-semibold font-minnie text-gray-800 mb-2 md:mb-4">/tasks</h3>
                                <p className="text-lg text-gray-600 font-impress mb-2">Lists your active toontasks and progress.</p>
                            </div>

                            {/* /support command */}
                            <div className="bg-pink-100 p-4 md:p-6 rounded-lg shadow-md border border-gray-300">
                                <h3 className="text-xl font-semibold font-minnie text-gray-800 mb-2 md:mb-4">/support</h3>
                                <p className="text-lg text-gray-600 font-impress mb-2">Get a Discord link to our support server.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default HomePage;