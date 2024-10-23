import React from 'react';

interface AuthProps {
  initiateOAuth: () => void;
  handleMouseDown: () => void;
  handleMouseUp: () => void;
  handleMouseLeave: () => void;
  isPressed: boolean;
}

const Auth: React.FC<AuthProps> = ({
  initiateOAuth,
  handleMouseDown,
  handleMouseUp,
  handleMouseLeave,
  isPressed,
}) => {
  const clickedImg = '/images/button-clicked.png';
  const unclickedImg = '/images/button-unclicked.png';

  return (
    <div className="flex w-full max-w-xl mx-auto">
      <div className="bg-white p-6 md:p-10 rounded-lg shadow-lg text-center border border-gray-300 space-y-6 md:space-y-5 mt-10">
        <h2 className="text-3xl font-semibold font-minnie text-gray-800 mb-6">Connect to Discord</h2>
        <p className="text-xl text-gray-600 font-impress">ToonScout needs a Discord connection to function.</p>
        <p className="text-xl text-gray-600 font-impress">Click the button below to begin!</p>
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
  );
};

export default Auth;
