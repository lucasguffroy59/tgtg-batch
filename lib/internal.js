const date = require("../utils/date");

const canBeNotified = (currentDate, stores, notifDetails) => {
  let canBeNotif = true;
  for (const aStore of stores) {
    const hasAlreadyBeenNotifiedRecently = notifDetails.filter(
      (aDetail) =>
        aDetail.storeId === aStore &&
        date.wasLessThanXHoursAgo(currentDate, aDetail.date, 24)
    );
    if (hasAlreadyBeenNotifiedRecently.length) canBeNotif = false;
  }
  return canBeNotif;
};

module.exports = { canBeNotified };
