const snsLib = require("../lib/sns");
const dynamoLib = require("../lib/dynamo");
const tgtgLib = require("../lib/tooGoodToGo");
const dateUtil = require("../utils/date");
const internalLib = require("../lib/internal");

const handler = async () => {
  const currentDateTime = new Date();
  console.time("LOGIN");
  await tgtgLib.login();
  console.timeEnd("LOGIN");
  console.time("GET_ALL_USERS");
  const users = await dynamoLib.getAllUserInfo();
  console.timeEnd("GET_ALL_USERS");
  console.log(`${users.length} users retrieved`);

  console.time("GET_ALL_BASKETS");
  const mainProcess = users.map(async (anUser) => {
    if (!dateUtil.dateIsValid(currentDateTime, anUser.notifPreference)) return;
    if (!dateUtil.canBeNotified(currentDateTime, anUser.lastNotificationDate))
      return;
    const availItems = await tgtgLib.getAvailableBaskets(
      anUser.location.lat,
      anUser.location.long,
      anUser.radius
    );
    if (availItems.length) {
      console.log(
        `${availItems.length} baskets available for user ${anUser.contact}`
      );
      const stores = availItems.map((anItem) => anItem.store.store_id);
      if (
        !internalLib.canBeNotified(
          currentDateTime,
          stores,
          anUser.lastStoreNotif
        )
      )
        return;
      await snsLib.publishAvailableBaskets(anUser.contact, availItems.length);
      await dynamoLib.updateBasicCooldown(anUser.contact);
      await dynamoLib.updateDetailedCooldown(anUser.contact, stores);
    }
  });
  await Promise.all(mainProcess);
  console.timeEnd("GET_ALL_BASKETS");
  console.log("Everything went fine");
  return {};
};

module.exports = { handler };
