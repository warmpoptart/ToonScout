import React from 'react';

const GameSteps: React.FC = () => (
  <div className="fixed inset-0 flex justify-center items-center bg-gags-pattern bg-repeat">
    <div className="bg-white p-10 rounded-lg shadow-lg text-center space-y-6 border border-gray-300">
      <h2 className="text-3xl font-semibold font-minnie text-gray-800 mb-4">Connecting to Toontown Rewritten...</h2>
      <div className="flex justify-center space-x-8">
        <Step title="1. Enable Companion App Support" image="/images/gameplay-menu.png" />
        <Step title="2. Click 'OK' on in-game popup" image="/images/prompt.png" />
      </div>
      <h2 className="text-3xl font-semibold font-minnie text-gray-800 mb-4">Finally, select a toon to continue!</h2>
    </div>
  </div>
);

const Step: React.FC<{ title: string; image: string }> = ({ title, image }) => (
  <div className="bg-gray-100 p-6 rounded-lg shadow-md border border-gray-300">
    <h2 className="text-2xl font-semibold font-minnie text-gray-800 mb-4">{title}</h2>
    <img src={image} alt={title} className="mx-auto" />
  </div>
);

export default GameSteps;
