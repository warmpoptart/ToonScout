import React from 'react';

const Disclaimer: React.FC = () => (
  <div className="text-xs text-gray-500 font-sans-serif mt-4">
    <p>
      ToonScout only stores your public Discord ID and latest toon data. If you wish for your data to be removed, please contact us at our 
      <a href="https://discord.gg/Qb929SrdRP" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-1">support server</a>.
    </p>
  </div>
);

export default Disclaimer;
