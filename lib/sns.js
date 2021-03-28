const AWS = require("aws-sdk");

const sns = new AWS.SNS();

/**
 * Publish message to SNS Topic specifying that there is available baskets
 */
const publishAvailableBaskets = async (phoneNumber, nbBaskets) => {
  const params = {
    Message: JSON.stringify({
      default: `Il y a ${nbBaskets} panier(s) disponibles`,
      sms: `Il y a ${nbBaskets} panier(s) disponibles`,
    }),
    MessageStructure: "json",
    TopicArn: process.env.SNS_TOPIC_NOTIFY_CONSUMERS,
    MessageAttributes: {
      recipient: {
        DataType: "String",
        StringValue: phoneNumber,
      },
    },
  };
  await sns.publish(params).promise();
  console.log(`User ${phoneNumber} has been notified by SMS.`);
};

module.exports = { publishAvailableBaskets };
