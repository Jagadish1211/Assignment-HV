import "./styles.scss";
import React, { useEffect, useState, useRef } from "react";
import ScheduleCard from "../ScheduleCard";
import { useSelector, useDispatch } from "react-redux";
import { selectTabView } from "../../features/tabViews/tabViews";
import { setPlatformInfoAction } from "../../features/platformInfo/platformInfo";
import {
  saveTrainScheduleAction,
  saveTrainDashboardInfoAction,
} from "../../features/trainSchedule/trainSchedule";
import { stopSimulationAction } from "../../features/simulationControl/simulationControl";

const PlatformView = () => {
  const dispatch = useDispatch();
  const [showWaitForSimulationMessage, setShowWaitForSimulationMessage] =
    useState(false);

  //   const noOfPlatforms = useSelector(
  //     (state) => state.platformInfo.noOfPlatforms
  //   );
  const platformInfo = useSelector((state) => state.platformInfo.platformInfo);
  const trainDashboardInfo = useSelector(
    (state) => state.trainSchedule.trainDashboardInfo
  );
  const trainSchedule = useSelector(
    (state) => state.trainSchedule.trainSchedule
  );
  const simulationActive = useSelector(
    (state) => state.simulationControl.simulationActive
  );

  const platformInfoRef = useRef(platformInfo);
  const trainScheduleRef = useRef(trainSchedule);
  const trainDashboardInfoRef = useRef(trainDashboardInfo);

  useEffect(() => {
    platformInfoRef.current = platformInfo;
  }, [platformInfo]);

  useEffect(() => {
    trainScheduleRef.current = trainSchedule;
  }, [trainSchedule]);

  useEffect(() => {
    trainDashboardInfoRef.current = trainDashboardInfo;
  }, [trainDashboardInfo]);

  // trainStatus has three states, 'arriving', 'departing', 'idle'
  // whenever the train state changes, the state of the dashboard and the state of the platform should change

  const checkTrainStatus = (platform, currentTime) => {
    const { train } = platform;
    const { arrivalTime, departureTime, trainStatus } = train;

    // const arrivalTimeInMs = new Date(arrivalTime).getTime();
    const departureTimeInMs = new Date(departureTime).getTime();
    const arrivalTimeInMs = new Date(arrivalTime).getTime();

    if (trainStatus === "arriving") {
      if (currentTime < departureTimeInMs) {
        // arriving to idle
        // get the actual arrival time and the delay if any

        const delayInArrival = (
          (currentTime - arrivalTimeInMs) /
          60000
        ).toFixed(0);
        const updatedTrainDashboardInfo = trainDashboardInfoRef.current.map(
          (trainInfoItem) => {
            if (train.trainNumber === trainInfoItem.trainNumber) {
              console.log({
                ...trainInfoItem,
                actualArrivalTime: currentTime,
                delayInArrival,
              });

              return {
                ...trainInfoItem,
                actualArrivalTime: currentTime,
                delayInArrival,
              };
            }

            return trainInfoItem;
          }
        );

        trainDashboardInfoRef.current = updatedTrainDashboardInfo;
        dispatch(saveTrainDashboardInfoAction(updatedTrainDashboardInfo));

        return {
          ...platform,
          train: {
            ...train,
            trainStatus: "idle",
          },
          isOccupied: true,
        };
      } else {
        // arriving to departing-- for trains scheduled in the day before the simulation has run
        // get the actual arrival time and the delay if any, and departure time

        const delayInArrival = (
          (currentTime - arrivalTimeInMs) /
          60000
        ).toFixed(0);
        const updatedTrainDashboardInfo = trainDashboardInfoRef.current.map(
          (trainInfoItem) => {
            if (train.trainNumber === trainInfoItem.trainNumber) {
              console.log({
                ...trainInfoItem,
                actualArrivalTime: currentTime,
                actualDepartureTime: currentTime,
                delayInArrival,
              });

              return {
                ...trainInfoItem,
                actualArrivalTime: currentTime,
                actualDepartureTime: currentTime,
                delayInArrival,
              };
            }

            return trainInfoItem;
          }
        );

        trainDashboardInfoRef.current = updatedTrainDashboardInfo;
        dispatch(saveTrainDashboardInfoAction(updatedTrainDashboardInfo));

        return {
          ...platform,
          train: {
            ...train,
            trainStatus: "departing",
          },
          isOccupied: true,
        };
      }
    } else if (trainStatus === "departing") {
      return {
        ...platform,
        train: {
          ...train,
          trainNumber: null,
          arrivalTime: null,
          departureTime: null,
          trainStatus: "idle",
        },
        isOccupied: false,
      };
    } else {
      // trainStatus is idle
      // check if the train is departing

      // idle to departure
      // get the departure time and delay in departure
      const delayInDeparture = (
        (currentTime - departureTimeInMs) /
        60000
      ).toFixed(0);
      const updatedTrainDashboardInfo = trainDashboardInfoRef.current.map(
        (trainInfoItem) => {
          if (train.trainNumber === trainInfoItem.trainNumber) {
            return {
              ...trainInfoItem,
              actualDepartureTime: currentTime,
              delayInDeparture,
            };
          }

          return trainInfoItem;
        }
      );

      trainDashboardInfoRef.current = updatedTrainDashboardInfo;
      dispatch(saveTrainDashboardInfoAction(updatedTrainDashboardInfo));

      if (currentTime >= departureTimeInMs) {
        //
        return {
          ...platform,
          train: {
            ...train,
            trainStatus: "departing",
          },
          isOccupied: true,
        };
      } else {
        return platform;
      }
    }
  };

  const trainNotAlreadyPresent = (platformInfo, trainNumber) => {
    return !platformInfo.some(
      (platform) => platform.train.trainNumber === trainNumber
    );
  };

  const checkIfAllPlatformsAreEmpty = (platformInfo) => {
    return !platformInfo.some(
      (platform) => platform.train.trainStatus !== "departed"
    );
  };

  useEffect(() => {
    if (simulationActive) {
      setShowWaitForSimulationMessage(true);
    }
  }, [simulationActive]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowWaitForSimulationMessage(false);
      if (!simulationActive) {
        clearInterval(interval);
        return;
      }

      const currentTime = new Date().getTime();

      const updatePlatformInfoState = (currentTime) => {
        const updatedPlatformInfo = platformInfoRef.current.map((platform) => {
          // check if platform is occupied
          if (platform?.isOccupied) {
            // check the train status
            return checkTrainStatus(platform, currentTime);
          } else {
            // check the schedule for the train that should be present at that time and update the platform info
            if (
              trainScheduleRef.current.length === 0 &&
              checkIfAllPlatformsAreEmpty(platformInfoRef.current)
            ) {
              clearInterval(interval);
              dispatch(stopSimulationAction());
              return platform;
            }

            const trainsThatShouldBePresent = trainScheduleRef.current.filter(
              ({ arrivalTime, departureTime, trainNumber }) => {
                const arrivalTimeInMs = new Date(arrivalTime).getTime();
                //   const departureTimeInMs = new Date(
                //     departureTime
                //   ).getTime();

                return (
                  currentTime >= arrivalTimeInMs &&
                  // currentTime < departureTimeInMs &&
                  trainNotAlreadyPresent(platformInfoRef.current, trainNumber)
                );
              }
            );

            if (trainsThatShouldBePresent?.length) {
              const selectedTrain = trainsThatShouldBePresent[0];

              const modifiedPlatform = {
                ...platform,
                isOccupied: true,
                train: {
                  trainNumber: selectedTrain.trainNumber,
                  arrivalTime: selectedTrain.arrivalTime,
                  departureTime: selectedTrain.departureTime,
                  priority: selectedTrain.priority,
                  trainStatus: "arriving",
                },
              };

              // update the schedule copy
              trainScheduleRef.current = trainScheduleRef.current.filter(
                (train) => train.trainNumber !== selectedTrain.trainNumber
              );
              dispatch(saveTrainScheduleAction(trainScheduleRef.current));

              return modifiedPlatform;
            } else {
              return platform;
            }
          }
        });

        dispatch(setPlatformInfoAction(updatedPlatformInfo));
      };

      updatePlatformInfoState(currentTime);
    }, 5000);

    return () => clearInterval(interval);
  }, [simulationActive]);

  //   if (!noOfPlatforms || trainSchedule.length === 0) {
  //     dispatch(selectTabView("Platform and Schedule Input"));
  //     return;
  //   }

  return (
    <>
      <div className="simulation-start-message">
        { showWaitForSimulationMessage ? 'Please wait for simulation to start..' : ''}
      </div>

      <div className="train-platform-view">
        <ScheduleCard trainSchedule={trainSchedule} />
        <div className="train-platform-view-platforms-container">
          {platformInfo?.map(({ platformNumber, train }) => {
            const currentTime = new Date().getTime();
            const timeLeftForDeparture =
              train?.trainStatus === "idle"
                ? ` - Departing in ${(
                    (new Date(train?.departureTime).getTime() - currentTime) /
                    1000
                  ).toFixed(0)}s`
                : "";

            return (
              <div
                key={platformNumber}
                className="train-platform-view-platform"
              >
                {`Platform ${platformNumber}`}
                {train?.trainNumber ? (
                  <div className={`train-block ${train?.trainStatus}`}>
                    {train?.trainNumber}
                    {timeLeftForDeparture}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default PlatformView;
