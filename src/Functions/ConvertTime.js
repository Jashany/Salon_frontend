const ConvertTime = (time) => {
    // Convert time to 12 hour format or 24 hour format

    // Check if time is in 24 hour format
    const is12Hour = time.includes("am") || time.includes("pm");
    if (!is12Hour) {
        // Convert 24 hour format to 12 hour format
        const [hours, minutes] = time.split(":");
        const suffix = hours >= 12 ? "pm" : "am";
        const newHours = hours % 12 || 12;
        return `${newHours}:${minutes} ${suffix}`;
    } else {
        // Convert 12 hour format to 24 hour format
        const [hours, minutes, suffix] = time.split(" ");
        const newHours = hours === "12" ? "00" : hours;
        return `${newHours}:${minutes}`;
    }

}

const MinuteToHours = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} hr`;
    return `${hours} hrs ${mins} min`;
};

export { ConvertTime, MinuteToHours };