const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient({
  endpoint:
    process.env.STAGE === "localhost"
      ? process.env.DYNAMODB_ENDPOINT
      : `https://dynamodb.${process.env.REGION}.amazonaws.com`,
});

/**
 * Perform a full scan of a database table
 * @param {string} tableName The database table name
 * @returns {Promise<object[]>} The content of the database table
 */
const scanDynamo = async (tableName) => {
  const options = {
    TableName: tableName,
  };
  return (await dynamo.scan(options).promise()).Items;
};

/**
 * Get every user info from database
 * @returns {Promise<object[]>} User infos
 */
const getAllUserInfo = async () => {
  const users = await scanDynamo(process.env.DYNAMODB_CONSUMERS_TABLE);
  return users;
};

/**
 * Update in the database the global last notification date of a user
 * @param {string} contact The user's contact
 */
const updateBasicCooldown = async (contact) => {
  const options = {
    TableName: process.env.DYNAMODB_CONSUMERS_TABLE,
    Key: { contact },
    UpdateExpression: "set #notifDate = :currentDate",
    ExpressionAttributeNames: { "#notifDate": "lastNotificationDate" },
    ExpressionAttributeValues: {
      ":currentDate": Date.now(),
    },
  };
  await dynamo.update(options).promise();
  console.log(
    `Global last notif date updated with current date for user ${contact}.`
  );
  return true;
};

/**
 * Update in the database the detailed last notification date by store of a user
 * @param {string} contact The user's contact
 * @param {array} stores Store id list
 */
const updateDetailedCooldown = async (contact, stores) => {
  const formattedDetail = stores.map((aStore) => ({
    storeId: aStore,
    date: Date.now(),
  }));
  const options = {
    TableName: process.env.DYNAMODB_CONSUMERS_TABLE,
    Key: { contact },
    UpdateExpression:
      "SET #lastStoreNotif = list_append(#lastStoreNotif,:detail)",
    ExpressionAttributeNames: { "#lastStoreNotif": "lastStoreNotif" },
    ExpressionAttributeValues: {
      ":detail": formattedDetail,
    },
  };
  await dynamo.update(options).promise();
  console.log(
    `Detailed last notif date updated with current date for user ${contact}.`
  );
  return true;
};

module.exports = {
  getAllUserInfo,
  updateBasicCooldown,
  updateDetailedCooldown,
};
