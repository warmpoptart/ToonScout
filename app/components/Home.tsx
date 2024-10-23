import React from 'react';
import CommandBox from './CommandBox';
import Disclaimer from './Disclaimer';

const commands = [
    { title: '/info', description: 'Displays your toon photo, laff, and location.', color: '#4A90E2' },
    { title: '/fish', description: 'Provides advising on where to fish or what to catch.', color: '#504ae2' },
    { title: '/suit', description: 'Get your suit progress and promotion recommendations.', color: '#9c4ae2' },
    { title: '/gags', description: 'Displays current gags and progress.', color: '#e24adc' },
    { title: '/tasks', description: 'Lists your active toontasks and progress.', color: '#e24a90' },
    { title: '/support', description: 'Get a Discord link to our support server.', color: '#e2504a' }, 
  ];

const Home = () => {
    return (
        <div className="flex-1 w-full max-w-6xl mx-auto">
            <div className="bg-white p-6 md:p-10 rounded-lg shadow-lg text-center border border-gray-300 space-y-6 md:space-y-5 mt-10">
                <h2 className="text-3xl font-semibold font-minnie text-gray-800">
                    Welcome to ToonScout!
                </h2>
                <p className="text-xl text-gray-600 font-impress">
                    <a
                        href="https://discord.com/oauth2/authorize?client_id=1286517155315322950"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <button
                            style={{
                                padding: '5px 20px',
                                backgroundColor: '#7289DA',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Add ToonScout on Discord
                        </button>
                    </a>
                    <br />
                    <br />
                    This page needs to stay in the background to continue receiving real-time information.
                    <br />
                    If you close it, you can still access your last saved data any time.
                    <br />
                    <br />
                    Run the commands below <strong>anywhere</strong> in Discord after adding with the button above!
                </p>

                {/* Commands Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {commands.map((command) => (
                    <CommandBox key={command.title} command={command} />
                    ))}
                </div>
        
                {/* Disclaimer */}
                <Disclaimer />
            </div>
        </div>
    );
};

export default Home;
