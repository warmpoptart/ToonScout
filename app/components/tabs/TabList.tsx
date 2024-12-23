import InfoTab from "./InfoTab";
import FishTab from "./FishTab";
import SuitTab from "./SuitTab";
import GagsTab from "./GagsTab";
import TasksTab from "./TasksTab";
import CommandTab from "./CommandTab";
import ActivityTab from "./ActivityTab";

export const TabList = [
  { title: "Commands", component: CommandTab },
  { title: "Overview", component: InfoTab },
  { title: "Fishing", component: FishTab },
  { title: "Suits", component: SuitTab },
  { title: "Gags", component: GagsTab },
  { title: "Tasks", component: TasksTab },
  { title: "Activities", component: ActivityTab },
];
