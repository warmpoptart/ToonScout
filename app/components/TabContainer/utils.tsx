import { ToonData } from "@/app/types";
import { golf_trophies } from "../../data/golf_trophies";
import { race_trophies } from "../../data/race_trophies";

export const displaySuit = (toonData: ToonData, type: string) => {
  if (!toonData.cogsuits[type].hasDisguise) {
    return;
  }

  const getPromotion = () => {
    if (dept.level == 50) {
      return "Maxed!";
    } else if (dept.promotion.current >= dept.promotion.target) {
      return "Ready for promotion!";
    } else {
      return `${dept.promotion.current} / ${dept.promotion.target}`;
    }
  };

  const getName = () => {
    if (dept.version == 2) {
      return `${dept.suit.name} v2.0`;
    }
    return dept.suit.name;
  };

  let dept = toonData.cogsuits[type];
  return (
    <div className="flex justify-center bg-violet-200 rounded-xl py-7 text-2xl w-full">
      <div className="text-2xl w-full">
        <h1>{getName()}</h1>
      </div>
      <div className="w-full">
        <h2>Level {dept.level}</h2>
      </div>
      <div className="w-full">
        <h2>{getPromotion()}</h2>
      </div>
    </div>
  );
};

export const sumFish = (toonData: ToonData) => {
  const fish = [];
  for (const key in toonData.fish.collection) {
    const album = toonData.fish.collection[key].album;
    for (const type in album) {
      fish.push(album[type].name);
    }
  }
  return fish.length;
};

export const sumGolf = (toonData: ToonData) => {
  let count = 0;
  for (const trophy of golf_trophies) {
    const earned =
      toonData.golf.find((item) => item.name == trophy.description)?.num || 0;
    for (const val of trophy.values) {
      if (earned >= val) {
        count += 1;
      }
    }
  }
  return count;
};

export const sumRace = (toonData: ToonData) => {
  let count = 0;
  for (const trophy of race_trophies) {
    const earned =
      toonData.racing.find((item) => item.name == trophy.description)?.num || 0;
    for (const val of trophy.values) {
      if (earned >= val) {
        count += 1;
      }
    }
  }
  return count;
};

export const sumFlowers = (toonData: ToonData) => {
  let collection = toonData.flowers.collection;
  let count = 0;
  for (const key in collection) {
    if (collection.hasOwnProperty(key)) {
      count += Object.keys(collection[key].album).length;
    }
  }
  return count;
};
