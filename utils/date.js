/**
 * Know if a date is between a specified start and end time of the day
 * @param {Date} date The date to test
 * @param {string} startTime Start hour (hh:mm)
 * @param {string} endTime End hour (hh:mm)
 * @returns {boolean} True if date is in the range, false if not
 */
const isBetween = (date, startTime, endTime) => {
  const start = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    Number(startTime.split(":")[0]),
    Number(startTime.split(":")[1])
  );
  const end = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    Number(endTime.split(":")[0]),
    Number(endTime.split(":")[1])
  );

  return date >= start && date < end;
};

/**
 * Know if a current date matches hour ranges preferences (is in one of them)
 * @param {Date} currentDate Current date
 * @param {object[]} preferences An array of time ranges
 * @returns {boolean} True if current date matches preferences, false if not
 */
const dateIsValid = (currentDate, preferences) => {
  const validDates = preferences.filter(({ start, end }) =>
    isBetween(currentDate, start, end)
  );
  return validDates.length > 0;
};

/**
 * Know if you can notify again a user, depending on last time you notified him
 * @param {Date} currentDate Current date
 * @param {Date} lastNotification Timestamp representing last time user was notified
 * @returns {boolean} True if can be notified, false if cooldown still active
 */
const canBeNotified = (currentDate, lastNotification) => {
  const isValid = lastNotification + 1 * 60 * 60 * 1000 <= currentDate;
  return isValid;
};

/**
 * Know if a date was less than X hours ago by specifying current date
 * @param {Date} currentDate Current date
 * @param {Date} date A date represented by a timestamp
 * @param {number} hours A number of hours
 * @returns {boolean} True if date is less than X hours ago, else false
 */
const wasLessThanXHoursAgo = (currentDate, date, hours) => {
  console.log({ currentDate, date, hours });
  const isValid = date + hours * 60 * 60 * 1000 > currentDate;
  return isValid;
};

module.exports = { dateIsValid, canBeNotified, wasLessThanXHoursAgo };
