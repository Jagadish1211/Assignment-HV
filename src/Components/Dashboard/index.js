import "./styles.scss";
import { useSelector } from "react-redux";
import { convertSecondsToHrMinSecFormat } from "../../Utils";

const Dashboard = () => {
    const trainDashboardInfo = useSelector((state) => state.trainSchedule.trainDashboardInfo);

    const formatTimeDataForDashboard = (time) => {
        if(!time) return '-';
        const date = new Date(time);
        const hours = date.getHours();
        const minutes = date.getMinutes();

        return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
    }

  return (
    <div className="train-dashboard">
      <h1>Dashboard</h1>
      <div>
        <table>
          <tr>
            <th>Train No</th>
            <th>Priority</th>
            <th>Scheduled Arrival Time</th>
            <th>Actual Arrival Time</th>
            <th>Scheduled Departure Time</th>
            <th>Actual Departure Time</th>
            <th>Delay in Arrival (in minutes)</th>
            <th>Delay in Departure (in minutes)</th>
          </tr>

            {trainDashboardInfo?.map(({ trainNumber, priority, arrivalTime, actualArrivalTime, departureTime, actualDepartureTime, delayInArrival, delayInDeparture }) => {
                return (
                    <tr key={trainNumber}>
                        <td>{trainNumber}</td>
                        <td>{priority}</td>
                        <td>{formatTimeDataForDashboard(arrivalTime)}</td>
                        <td>{formatTimeDataForDashboard(actualArrivalTime)}</td>
                        <td>{formatTimeDataForDashboard(departureTime)}</td>
                        <td>{formatTimeDataForDashboard(actualDepartureTime)}</td>
                        <td>{convertSecondsToHrMinSecFormat(delayInArrival) || '-'}</td>
                        <td>{convertSecondsToHrMinSecFormat(delayInDeparture) || '-'}</td>
                    </tr>
                );
            })}

        </table>
      </div>
    </div>
  );
};

export default Dashboard;
