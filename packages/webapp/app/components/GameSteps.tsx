import React from "react";
import LoadingDots from "@/app/components/animations/LoadingDots";
import Image, { type StaticImageData } from "next/image";
import "/styles/gamesteps.css";
import { imageAssets } from "@/assets/images";

const GameSteps: React.FC = () => (
  <div className="p-6">
    <div className="relative flex flex-row justify-center items-center w-full">
      <LoadingDots
        className="minnie-title text-4xl pb-4 w-full text-center"
        text="Connecting to Toontown Rewritten"
      />
    </div>
    <div className="step-container">
      <Step
        title="1. Enable Companion App Support"
        image={imageAssets.gameplay_menu}
      />
      <Step
        title="2. Click 'OK' on in-game popup and select a toon"
        image={imageAssets.prompt}
      />
    </div>
  </div>
);

const Step: React.FC<{ title: string; image: StaticImageData }> = ({
  title,
  image,
}) => (
  <div className="step-card">
    <h2 className="step-name">{title}</h2>
    <Image
      src={image}
      alt={title}
      className="mx-auto"
      width={256}
      height={256}
    />
  </div>
);

export default GameSteps;
