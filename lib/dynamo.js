const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

/**
 * Perform a full scan of a database table
 * @param {string} tableName The database table name
 * @returns {Promise<[object]>} The content of the database table
 */
const scanDynamo = async (tableName) => {
  const options = {
    TableName: tableName,
  };
  return (await dynamo.scan(options).promise()).Items;
};

/**
 * Get every user info from database
 * @returns {Promise<[object]>} User infos
 */
const getAllUserInfo = async () => {
  console.log("Retrieving user info list ...");
  const users = await scanDynamo("TGTG-consumers");
  console.log("User info retrieved successfully.");
  return users;
};

/**
 * Update in the database the last notification date of a user
 * @param {string} phoneNumber The user's phone number
 */
const updateNotifDate = async (phoneNumber) => {
  const options = {
    TableName: "TGTG-consumers",
    Key: { phoneNumber },
    UpdateExpression: "set #notifDate = :currentDate",
    ExpressionAttributeNames: { "#notifDate": "lastNotificationDate" },
    ExpressionAttributeValues: {
      ":currentDate": Date.now(),
    },
  };
  console.log("Updating last notif date ...");
  await dynamo.update(options).promise();
  console.log("Last notif date updated with current date.");
};

module.exports = { getAllUserInfo, updateNotifDate };
