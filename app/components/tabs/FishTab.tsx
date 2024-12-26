import React, { useEffect, useState } from "react";
import AnimatedTabContent from "../animations/AnimatedTab";
import { TabProps } from "../TabContainer/TabComponent";
import { sumFish } from "../TabContainer/utils";
import { FishRarity } from "@/app/types";

const FishTab: React.FC<TabProps> = ({ toonData }) => {
  const [fish, setFish] = useState<FishRarity[] | null>(null);

  useEffect(() => {
    const getFish = async () => {
      const response = await fetch("http://localhost:3001/get-fish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ toonData }),
      });
      if (!response.ok) {
        return "Error loading fish data. Please try again later.";
      }
      const data = await response.json();
      setFish(data);
    };

    getFish();
  }, [toonData]);

  return (
    <AnimatedTabContent>
      <div className="fish-container">
        <div className="fish-header">
          <div className="fishitem">
            <p>{sumFish(toonData)} / 70 caught</p>
          </div>
          <div className="fishitem">
            <p>prev page,next page</p>
          </div>
        </div>

        <div className="fishtank">
          {fish ? (
            fish.map((item, index) => (
              <p className="fish" key={index}>
                <div className="w-full">
                  {index + 1}. {item.name}
                </div>
                <div className="w-full">{item.location}</div>
                <div className="w-full">
                  {(item.probability * 100).toFixed(2) != "0.00"
                    ? `${(item.probability * 100).toFixed(2)}%`
                    : "Nearly impossible to catch..."}
                </div>
              </p>
            ))
          ) : (
            <p className="fish">Loading...</p>
          )}
        </div>
      </div>
    </AnimatedTabContent>
  );
};

export default FishTab;
