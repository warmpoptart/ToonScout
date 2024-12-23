import React, { useEffect, useState } from "react";
import CommandBox from "../CommandBox";

const commands = [
  {
    title: "/info",
    description: "Displays your toon photo, laff, and location.",
    color: "#4A90E2",
  },
  {
    title: "/fish",
    description: "Provides advising on where to fish or what to catch.",
    color: "#4c7fe2",
  },
  {
    title: "/suit",
    description: "Get suit progress and recommendations.",
    color: "#4d6de2",
  },
  {
    title: "/gags",
    description: "Displays current gags and progress.",
    color: "#504AE2",
  },
  {
    title: "/tasks",
    description: "Lists your active toontasks and progress.",
    color: "#764AE2",
  },
  {
    title: "/race",
    description: "Provides advising on racing trophies.",
    color: "#9C4AE2",
  },
  {
    title: "/golf",
    description: "Provides advising on golfing trophies.",
    color: "#BF4ADF",
  },
  {
    title: "/hidden",
    description: "Set if your info can be viewed by others.",
    color: "#E24ADC",
  },
  {
    title: "...and more!",
    description: "You can see all other commands in Discord!",
    color: "#E24AB6",
  },
];

const CommandTab: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`tab-content ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <span className="text-block p-2">
        Run the commands below <strong>anywhere</strong> in Discord after adding
        with the button above!
      </span>
      <div className="cmd-container">
        {commands.map((command) => (
          <CommandBox key={command.title} command={command} />
        ))}
      </div>
    </div>
  );
};

export default CommandTab;
