import { useSelector } from "react-redux";
import "./App.scss";
import PlatformView from "./components/PlatformView";
import TabView from "./components/TabView";
import PlatformInput from "./components/PlatformAndScheduleInput";
import Dashboard from "./components/Dashboard";

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
