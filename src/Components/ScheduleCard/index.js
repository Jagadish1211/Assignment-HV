import './styles.scss';

const ScheduleCard = ({ trainSchedule }) => {

    return (
        <div className='train-schedule-card'>
            { trainSchedule?.map(({ trainNumber, priority, arrivalTime, arrivalTimeString}) => {
                return (
                    <div className='train-schedule-card-train' key={trainNumber}>
                        { `${trainNumber} - ${arrivalTimeString} - ${priority}` }
                    </div>
                )
            })}
        </div>
    )
}

export default ScheduleCard;