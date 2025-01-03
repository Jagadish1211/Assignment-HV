import "./styles.scss";
import React, { useState } from "react";
import Papa from "papaparse";
import { useDispatch } from "react-redux";

import { saveTrainSchedule } from "../../features/trainSchedule/trainSchedule";
import {
  setNoOfPlatformsAction,
  setPlatformInfoAction,
} from "../../features/platformInfo/platformInfo";
import { selectTabView } from "../../features/tabViews/tabViews";
import { sortScheduleByArrivalTimeAndPriority, formatTimeString } from "../../Utils";

const PlatformInput = () => {
  const dispatch = useDispatch();
  const [trainSchedule, setTrainSchedule] = useState(null);
  const [noOfPlatforms, setNoOfPlatforms] = useState(2);

  const handlePlatformAndScheduleSubmit = (e) => {
    e.preventDefault();

    if (noOfPlatforms && trainSchedule) {
      const sortedSchedule = sortScheduleByArrivalTimeAndPriority(trainSchedule);
      console.log("trainSchedule", sortedSchedule);
      dispatch(saveTrainSchedule(sortedSchedule));
      dispatch(setNoOfPlatformsAction(noOfPlatforms));

      const initialPlatformInfo = Array.from(
        { length: noOfPlatforms },
        (_, index) => ({
          platformNumber: index + 1,
          isOccupied: false,
          train: {
            trainNumber: null,
            arrivalTime: null,
            departureTime: null,
            priority: null,
            trainStatus: "idle", // this has
          },
        })
      );

      dispatch(setPlatformInfoAction(initialPlatformInfo));
      dispatch(selectTabView("Platforms"));
    }
  };

  const handleTrainScheduleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // columns in csv file: Train No, Arrival Time, Departure Time, Priority

    Papa.parse(file, {
      header: true, // Interpret the first row as headers
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length) {
          return;
        }

        const formattedData = result.data.map((row) => ({
          trainNumber: parseFloat(row["Train No"]),
          arrivalTime: formatTimeString(row["Arrival Time"]),
          arrivalTimeString: row["Arrival Time"],
          departureTime: formatTimeString(row["Departure Time"]),
          priority: row["Priority"],
        }));

        setTrainSchedule(formattedData);
      },
    });
  };

  const handleNoOfPlatformsInput = (event) => {
    const number = event.target.value;
    setNoOfPlatforms(number);
  };

  return (
    <div className="platform-and-schedule-input-form-container">
      <form onSubmit={handlePlatformAndScheduleSubmit}>
        {/* CSV File Input */}
        <div>
          <label htmlFor="csvFile">Upload CSV File for train schedule:</label>
          <input
            type="file"
            id="csvFile"
            accept=".csv"
            required
            onChange={handleTrainScheduleFileUpload}
          />
        </div>

        {/* Number Input */}
        <div>
          <label htmlFor="numberInput">Enter number of platforms:</label>
          <input
            type="number"
            id="numberInput"
            min={2}
            max={20}
            value={noOfPlatforms}
            onChange={handleNoOfPlatformsInput}
          />
        </div>

        {/* Submit Button */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PlatformInput;
