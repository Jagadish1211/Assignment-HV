import { useSelector } from "react-redux";
import "./App.scss";
import PlatformView from "./Components/PlatformView";
import TabView from "./Components/TabView";
import PlatformInput from "./Components/PlatformAndScheduleInput";
import Dashboard from "./Components/Dashboard";

function App() {
  const activeTabView = useSelector((state) => state.tabViews.activeTabView);

  const ActiveTab = () => {
    switch (activeTabView) {
      case "Platform and Schedule Input":
        return <PlatformInput />;
      case "Platforms":
        return <PlatformView />;
      case "Dashboard":
        return <Dashboard />;
      default:
        return <PlatformInput />;
    }
  };

  return (
    <div className="train-container">
      <TabView />

      <ActiveTab />
    </div>
  );
}

export default App;
