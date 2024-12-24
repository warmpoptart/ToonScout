import InfoTab from "./tabs/InfoTab";
import FishTab from "./tabs/FishTab";
import SuitTab from "./tabs/SuitTab";
import GagsTab from "./tabs/GagsTab";
import TasksTab from "./tabs/TasksTab";
import CommandTab from "./tabs/CommandTab";
import ActivityTab from "./tabs/ActivityTab";
import { useEffect, useState } from "react";
import { useToonContext } from "../context/ToonContext";
import "../styles/tabs.css";

export type TabComponent = {
  title: string;
  component: React.FC<{}>;
};

export const TabList: TabComponent[] = [
  { title: "Commands", component: CommandTab },
  { title: "Overview", component: InfoTab },
  { title: "Fishing", component: FishTab },
  { title: "Suits", component: SuitTab },
  { title: "Gags", component: GagsTab },
  { title: "Tasks", component: TasksTab },
  { title: "Activities", component: ActivityTab },
];

const TabContainer = () => {
  const [selectedTab, setSelectedTab] = useState<TabComponent>(TabList[1]); // Default to "Overview"
  const { toonData } = useToonContext();
  const [isVisible, setIsVisible] = useState(false);

  if (!toonData) {
    return "No toon data found. Please try refreshing the page.";
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const getImage = () => {
    const dna = toonData.toon.style;
    const pose = "waving";
    return `https://rendition.toontownrewritten.com/render/${dna}/${pose}/1024x1024.png`;
  };

  const handleTabChange = (tab: TabComponent) => {
    setSelectedTab(tab);
  };

  return (
    <>
      <div className="tab-container">
        {TabList.map((tab) => (
          <button
            key={tab.title}
            className="tab-btn"
            aria-selected={selectedTab == tab ? true : false}
            onClick={() => handleTabChange(tab)}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div
        className={`tab-content ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {selectedTab && selectedTab.title !== "Commands" ? (
          <div className="info-container">
            <div className="left-info-container">
              <div>
                <p className="text-3xl bg-violet-600 text-white rounded-lg py-1">
                  {toonData.toon.name}
                </p>
                <p className="text-2xl pt-1">
                  {toonData.laff.current}/{toonData.laff.max} laff
                </p>
                <p className="text-xl">
                  {toonData.location.zone}, {toonData.location.district}
                </p>
              </div>
              <div className="toon-photo">
                <img
                  src={getImage()}
                  alt={`${toonData.toon.name} waving`}
                  className="w-512 h-512"
                />
              </div>
            </div>

            <div className="right-info-container">
              <selectedTab.component />
            </div>
          </div>
        ) : (
          <selectedTab.component />
        )}
      </div>
    </>
  );
};

export default TabContainer;
