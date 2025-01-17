export const priorityOrder = {
    P1: 3, // Highest priority
    P2: 2,
    P3: 1, // Lowest priority
  };

export const sortScheduleByArrivalTimeAndPriority = (schedule) => {
    schedule.sort((a, b) => {
        const arrivalTimeInMsA = new Date(a.arrivalTime).getTime();
        const arrivalTimeInMsB = new Date(b.arrivalTime).getTime();

        const priorityOrder = {
            P1: 3, // Highest priority
            P2: 2,
            P3: 1, // Lowest priority
          };

        if (arrivalTimeInMsA < arrivalTimeInMsB) {
        return -1;
        } else if (arrivalTimeInMsA > arrivalTimeInMsB) {
        return 1;
        } else {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
    });

    return schedule
};

export const formatTimeString = (time) => {
    const [hours, minutes] = time.split(":");
  
    const now = new Date();
  
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    ).toISOString();
  };

export const convertSecondsToHrMinSecFormat = (seconds) => {
    if (!seconds || seconds === '-') return '-'
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = (seconds % 60).toFixed(0);
  
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
}
