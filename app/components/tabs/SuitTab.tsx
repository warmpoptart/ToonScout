import React, { useEffect, useState } from "react";
import { TabProps } from "../TabContainer/TabComponent";
import { getSuitName } from "../TabContainer/utils";
import AnimatedTabContent from "../animations/AnimatedTab";

interface PromotionPath {
  path: Array<string>;
  total: number;
}

const SuitTab: React.FC<TabProps> = ({ toonData }) => {
  const [dept, setDept] = useState("s");
  const [promo, setPromo] = useState<PromotionPath | null>(null);
  const suit = toonData.cogsuits[dept];

  useEffect(() => {
    const getPromo = async () => {
      const response = await fetch("http://localhost:3001/get-promo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ toonData, dept }),
      });
      if (!response.ok) {
        return "Error loading promo data. Please try again later.";
      }
      const data = await response.json();
      setPromo(data);
    };

    getPromo();
  }, [toonData, dept]);

  const sortPath = () => {
    if (!promo) return [];
    const counts = promo.path.reduce((acc, activity) => {
      acc[activity] = (acc[activity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([activity, count]) => ({
      activity,
      count,
    }));
  };

  const getPromo = () => {
    const path = sortPath();
    return path.map((entry, index) => (
      <div key={index} className="promo-item">
        <div className="promo-count">{entry.count} </div>
        <div className="promo-activity">{entry.activity}</div>
      </div>
    ));
  };

  return (
    <AnimatedTabContent>
      <div className="tab-suit-container">
        <div className="dept-container">
          <button onClick={() => setDept("s")} className="suit-btn">
            <img src="/images/emblem_sell.png" className="dept-photo" />
          </button>
          <button onClick={() => setDept("m")} className="suit-btn">
            <img src="/images/emblem_cash.png" className="dept-photo" />
          </button>
          <button onClick={() => setDept("l")} className="suit-btn">
            <img src="/images/emblem_law.png" className="dept-photo" />
          </button>
          <button onClick={() => setDept("c")} className="suit-btn">
            <img src="/images/emblem_boss.png" className="dept-photo" />
          </button>
        </div>
        <div className="suit-container">
          <div className="suit-overview">
            <div>{getSuitName(toonData, dept)}</div>
            <div>Level {suit.level}</div>
            <div>
              {suit.promotion.current} / {suit.promotion.target}
            </div>
          </div>
          <div className="promo-rec">
            <div className="font-minnie text-3xl pb-5">
              Recommended Activities
            </div>
            {promo ? getPromo() : <div>Loading...</div>}
            <div>Estimated Total: {promo?.total}</div>
          </div>
        </div>
      </div>
    </AnimatedTabContent>
  );
};

export default SuitTab;
