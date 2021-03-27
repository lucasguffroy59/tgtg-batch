const snsLib = require("./lib/sns");
const dynamoLib = require("./lib/dynamo");
const tgtgLib = require("./lib/tooGoodToGo");
const dateUtil = require("./utils/date");
const internalLib = require("./lib/internal");

const handler = async () => {
  const currentDateTime = new Date()
  currentDateTime.setTime(currentDate.getTime() + 1 * 60 * 60 * 1000);
  const users = await dynamoLib.getAllUserInfo();
  console.log("Users retrieved", users);

  const process = users.map(async (anUser) => {
    if (!dateUtil.dateIsValid(currentDateTime, anUser.notifPreference)) return;
    if (!dateUtil.canBeNotified(currentDateTime, anUser.lastNotificationDate)) return;
    const availItems = await tgtgLib.getAvailableBaskets(
      anUser.location.lat,
      anUser.location.long,
      anUser.radius
    );
    if (availItems) {
      const stores = availItems.map((anItem) => anItem.store.store_id);
      if (!internalLib.canBeNotified(stores, anUser.lastStoreNotif)) return;
      await snsLib.publishAvailableBaskets();
      await dynamoLib.updateNotifDate(anUser.phoneNumber);
    }
  });
  await Promise.all(process);
  console.log("Everything went fine");
  return {};
};

module.exports = { handler };
