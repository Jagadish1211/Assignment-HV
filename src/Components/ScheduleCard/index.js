import "./styles.scss";
import AddDelayInput from "../AddDelayInput";

const ScheduleCard = ({ trainSchedule }) => {

  return (
    <div className="train-schedule-card">
    <div className="train-schedule-card-delay-instruction">Add delay time in the form of "hh:mm"</div>
      {trainSchedule?.map(
        ({ trainNumber, priority, arrivalTime, arrivalTimeString }) => {
          return (
            <div className="train-schedule-card-train" key={trainNumber}>
              {`${trainNumber} - ${arrivalTimeString} - ${priority}`}{" "}
              <span><AddDelayInput trainNumber={trainNumber}/></span>
            </div>
          );
        }
      )}
    </div>
  );
};

export default ScheduleCard;
