import "./styles.scss";
import React, { useEffect, useState, useRef } from "react";
import ScheduleCard from "../ScheduleCard";
import { useSelector, useDispatch } from "react-redux";
import { selectTabView } from "../../features/tabViews/tabViews";
import { setPlatformInfoAction } from "../../features/platformInfo/platformInfo";
import { saveTrainScheduleAction } from "../../features/trainSchedule/trainSchedule";

const PlatformView = () => {
  const dispatch = useDispatch();

  //   const noOfPlatforms = useSelector(
  //     (state) => state.platformInfo.noOfPlatforms
  //   );
  const platformInfo = useSelector((state) => state.platformInfo.platformInfo);
  const trainSchedule = useSelector(
    (state) => state.trainSchedule.trainSchedule
  );
  const simulationActive = useSelector(
    (state) => state.simulationControl.simulationActive
  );

  const platformInfoRef = useRef(platformInfo);
  const trainScheduleRef = useRef(trainSchedule);

  useEffect(() => {
    platformInfoRef.current = platformInfo;
  }, [platformInfo]);

  useEffect(() => {
    trainScheduleRef.current = trainSchedule;
  }, [trainSchedule]);

  // trainStatus has three states, 'arriving', 'departing', 'idle'
  // whenever the train state changes, the state of the dashboard and the state of the platform should change

  const checkTrainStatus = (platform, currentTime) => {
    const { train } = platform;
    const { arrivalTime, departureTime, trainStatus } = train;

    // const arrivalTimeInMs = new Date(arrivalTime).getTime();
    const departureTimeInMs = new Date(departureTime).getTime();

    if (trainStatus === "arriving") {
      if (currentTime < departureTimeInMs) {
        return {
          ...platform,
          train: {
            ...train,
            trainStatus: "idle",
          },
          isOccupied: true,
        };
      } else {
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

      if (currentTime >= departureTimeInMs) {
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
    const interval = setInterval(() => {
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

            console.log("this is", trainsThatShouldBePresent);

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
                ).toFixed(0)} seconds.`
              : "";

          return (
            <div key={platformNumber} className="train-platform-view-platform">
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
  );
};

export default PlatformView;
