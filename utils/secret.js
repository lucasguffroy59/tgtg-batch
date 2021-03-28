const AWS = require("aws-sdk");

const secretsManager = new AWS.SecretsManager();

const getSecretContent = async (name) => {
  const { SecretString: secretContent } = await secretsManager
    .getSecretValue({ SecretId: name })
    .promise();
  return JSON.parse(secretContent);
};

module.exports = { getSecretContent };
