import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { selectTabView } from "../../features/tabViews/tabViews";
import { startSimulationAction, stopSimulationAction } from "../../features/simulationControl/simulationControl";

const TabView = () => {
  const dispatch = useDispatch();
  const activeTabView = useSelector((state) => state.tabViews.activeTabView);
  const simulationActive = useSelector((state) => state.simulationControl.simulationActive);

  const handleTabSelection = (tabInfo) => {
    dispatch(selectTabView(tabInfo));
  };

  const handleStartSimulation = () => {
    dispatch(startSimulationAction());
  };

  const handleStopSimulation = () => {
    dispatch(stopSimulationAction());
  };

  const SimulationControls = () => {
    return activeTabView === "Platforms" ? (
      <>
        <button className="tab" disabled={simulationActive} onClick={handleStartSimulation}>
          Start Simulation
        </button>
        <button className="tab" disabled={!simulationActive} onClick={handleStopSimulation}>
          Stop Simulation
        </button>
      </>
    ) : (
      <></>
    );
  };

  return (
    <div className="tab-view">
      <button
        className="tab"
        disabled={simulationActive}
        onClick={() => handleTabSelection("Platform and Schedule Input")}
      >
        Platform and Schedule Input
      </button>
      <button className="tab" disabled={simulationActive} onClick={() => handleTabSelection("Platforms")}>
        Platforms View
      </button>
      <button className="tab" disabled={simulationActive} onClick={() => handleTabSelection("Dashboard")}>
        Dashboard
      </button>

      <SimulationControls />
    </div>
  );
};

export default TabView;
