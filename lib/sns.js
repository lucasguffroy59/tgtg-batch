const AWS = require("aws-sdk");

const sns = new AWS.SNS();

/**
 * Publish message to SNS Topic specifying that there is available baskets
 */
const publishAvailableBaskets = async () => {
  const params = {
    Message: JSON.stringify({
      default: "Il y a des paniers disponibles",
      sms: "Il y a des paniers disponibles",
    }),
    MessageStructure: "json",
    TopicArn: "arn:aws:sns:eu-west-1:104887580826:TgtgTopic",
  };
  console.log("Publishing message ...");
  await sns.publish(params).promise();
  console.log("Message published successfully.");
};

module.exports = { publishAvailableBaskets };
