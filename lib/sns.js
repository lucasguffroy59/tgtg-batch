const AWS = require("aws-sdk");

const sns = new AWS.SNS();

/**
 * Publish message to SNS Topic specifying that there is available baskets
 */
const publishAvailableBaskets = async (contact, nbBaskets) => {
  const params = {
    Message: JSON.stringify({
      default: `Il y a ${nbBaskets} panier(s) disponibles`,
      email: `Il y a ${nbBaskets} panier(s) disponibles`,
    }),
    MessageStructure: "json",
    TopicArn: process.env.SNS_TOPIC_NOTIFY_CONSUMERS,
    MessageAttributes: {
      recipient: {
        DataType: "String",
        StringValue: contact,
      },
    },
  };
  await sns.publish(params).promise();
  console.log(`User ${contact} has been notified by mail.`);
};

module.exports = { publishAvailableBaskets };
