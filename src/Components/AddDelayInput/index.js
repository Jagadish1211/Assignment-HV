import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  saveTrainScheduleAction,
  saveTrainDashboardInfoAction,
} from "../../features/trainSchedule/trainSchedule";

const AddDelayInput = ({ trainNumber }) => {
  // update schedule and dashboard with the latest arrival time
  const dispatch = useDispatch();
  const [delayTimeString, setDelayTimeString] = useState("");
  const inputRef = useRef()

  const trainDashboardInfo = useSelector(
    (state) => state.trainSchedule.trainDashboardInfo
  );
  const trainSchedule = useSelector(
    (state) => state.trainSchedule.trainSchedule
  );

  const handleTimeStringEntry = (e) => {
    setDelayTimeString(e.target.value);
  };

  const handleAddDelayToTrain = (trainNumber) => {
    // have the train number and time to be added
    if (!/^\d{2}:(?:[0-5][0-9])$/.test(delayTimeString)) {
      console.log("Please check format for entering delay");
      return;
    }

    inputRef.current.value= ''

    let newArrivalTime;
    let newDepartureTime;
    let newArrivalTimeString;

    const updatedTrainSchedule = trainSchedule.map((train) => {
      if (train.trainNumber === trainNumber) {
        const calculateNewDelayedTime = (time) => {
          const getCurrentArrivalTime = new Date(time).getTime();

          const [delayHours, delayMinutes] = delayTimeString
            .split(":")
            .map((item) => Number(item));
          const totalDelayInMs = (delayHours * 60 + delayMinutes) * 60 * 1000;

          const newArrivalTimeInISOString = new Date(
            totalDelayInMs + getCurrentArrivalTime
          );
          const now = new Date();

          console.log(delayTimeString);

          return new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            newArrivalTimeInISOString.getHours(),
            newArrivalTimeInISOString.getMinutes()
          ).toISOString();
        };

        newArrivalTime = calculateNewDelayedTime(train.arrivalTime);
        newDepartureTime = calculateNewDelayedTime(train.departureTime)

        const tempNewArrivalDateObject = new Date(newArrivalTime);
        newArrivalTimeString = `${
          tempNewArrivalDateObject.getHours() < 10
            ? `0${tempNewArrivalDateObject.getHours()}`
            : tempNewArrivalDateObject.getHours()
        }:${
          tempNewArrivalDateObject.getMinutes() < 10
            ? `0${tempNewArrivalDateObject.getMinutes()}`
            : tempNewArrivalDateObject.getMinutes()
        }`;

        return {
          ...train,
          arrivalTime: newArrivalTime,
          arrivalTimeString: newArrivalTimeString,
          departureTime: newDepartureTime
        };
      }

      return train;
    });

    const updatedTrainDashboardInfo = trainDashboardInfo.map((train) => {
      if (train.trainNumber === trainNumber) {
        return {
          ...train,
          arrivalTime: newArrivalTime,
          arrivalTimeString: newArrivalTimeString,
          departureTime: newDepartureTime
        };
      }

      return train;
    });

    dispatch(saveTrainScheduleAction(updatedTrainSchedule));
    dispatch(saveTrainDashboardInfoAction(updatedTrainDashboardInfo));
  };

  return (
    <>
      <input
        name="delayTime"
        ref={inputRef}
        onChange={(e) => handleTimeStringEntry(e)}
        type="text"
        id={`add-delay-${trainNumber}`}
      ></input>

      <button onClick={() => handleAddDelayToTrain(trainNumber)}>
        Add delay
      </button>
    </>
  );
};

export default AddDelayInput;
