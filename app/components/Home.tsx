import React, { useState, Suspense, useEffect } from "react";
import Disclaimer from "./Disclaimer";
import "../styles/home.css";
import TabContainer from "./TabComponent";

const Home = () => {
  

  return (
    <div className="card-container">
      <div className="home-card">
        <h2 className="text-4xl minnie-title">Welcome to ToonScout!</h2>
        <p>
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
            If you close it, you can still access your last saved data any time
            on Discord.
          </span>
        </p>

        <TabContainer />

        <Disclaimer />
      </div>
    </div>
  );
};

export default Home;
