import React from 'react';

const Disclaimer: React.FC = () => (
  <div className="text-xs text-gray-400 font-sans-serif mt-4 bg-gray-100 p-1 rounded-full">
    <p>
      ToonScout only stores your public Discord ID and latest toon data. If you wish for your data to be removed, please contact us at our 
      <a href="https://discord.gg/Qb929SrdRP" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline"> support server</a>.
    </p>
    <p>
        This website is not affiliated with Toontown Rewritten. 
    </p>
  </div>
);

export default Disclaimer;
