import React, { useState, Suspense } from "react";
import CommandBox from "./CommandBox";
import Disclaimer from "./Disclaimer";
import { TabList } from "./tabs/TabList";

const Home = () => {
  const [currTab, setCurrTab] = useState(TabList[0].title);

  const currTabComponent = TabList.find((tab) => tab.title === currTab);

  return (
    <div className="flex w-full max-w-6xl mx-auto">
      <div className="home-card">
        <h2 className="text-4xl minnie-title">Welcome to ToonScout!</h2>
        <p className="text-xl text-gray-600">
          <a
            href="https://discord.com/oauth2/authorize?client_id=1286517155315322950"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="add-btn">Add ToonScout on Discord</button>
          </a>
          <span className="text-block pt-6">
            This page needs to stay in the background to continue receiving
            real-time information.
          </span>
          <span className="text-block">
            If you close it, you can still access your last saved data any time.
          </span>
          {/* <span className="text-block">
            Run the commands below <strong>anywhere</strong> in Discord after
            adding with the button above!
          </span> */}
        </p>

        <div className="tab-container">
          {TabList.map((tab) => (
            <button
              key={tab.title}
              className={tab.title === currTab ? "curr-tab-btn" : "tab-btn"}
              onClick={() => setCurrTab(tab.title)}
            >
              {tab.title}
            </button>
          ))}
        </div>

        <div className="tab-content">
          <Suspense fallback={<div>Loading...</div>}>
            {currTabComponent ? (
              <currTabComponent.component />
            ) : (
              <div>Select a tab to view the content.</div>
            )}
          </Suspense>
        </div>

        {/* <div className="cmd-container">
          {commands.map((command) => (
            <CommandBox key={command.title} command={command} />
          ))}
        </div> */}

        <Disclaimer />
      </div>
    </div>
  );
};

export default Home;
