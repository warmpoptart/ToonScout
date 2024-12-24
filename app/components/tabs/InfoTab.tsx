import React from "react";
import { useToonContext } from "../../context/ToonContext";

const InfoTab: React.FC = () => {
  const { toonData } = useToonContext();

  console.log(toonData);
  return (
    <div>
      <p>info</p>
    </div>
  );
};

export default InfoTab;
