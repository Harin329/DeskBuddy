export function getFormattedDate(date: Date) {
    const currTime = date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1).toString().padStart(2, "0") +
        "-" + date.getUTCDate().toString().padStart(2, "0") + " " + date.getUTCHours().toString().padStart(2, "0") +
        ":" + date.getUTCMinutes().toString().padStart(2, "0") + ":00";

    return currTime;
}