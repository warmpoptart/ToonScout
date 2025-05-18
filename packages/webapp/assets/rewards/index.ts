// Static imports for all reward images
import type { StaticImageData } from "next/image";
import sos from "./sos.png";
import unites from "./unites.png";
import summons from "./summons.png";
import pinkslips from "./pinkslips.png";
import remotes from "./remotes.png";
import remotesheal from "./remotesheal.png";

export const rewardImages: Record<string, StaticImageData> = {
  sos,
  unites,
  summons,
  pinkslips,
  remotes,
  remotesheal,
};
