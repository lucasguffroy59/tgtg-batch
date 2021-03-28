const AWS = require("aws-sdk");

const secretsManager = new AWS.SecretsManager();

/**
 * Retrieve the content of a secret from AWS
 * @param {String} name The name of the secret
 * @returns {Object} The content of the secret
 */
const getSecretContent = async (name) => {
  const { SecretString: secretContent } = await secretsManager
    .getSecretValue({ SecretId: name })
    .promise();
  const parsedContent = JSON.parse(secretContent);
  return parsedContent;
};

module.exports = { getSecretContent };
