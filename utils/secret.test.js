const secret = require("./secret");

// Mock AWS SDK
jest.mock("aws-sdk", () => {
  return {
    // In AWS SDK, mock SecretsManager constructor
    SecretsManager: jest.fn(() => {
      return {
        // In SecretsManager, mock getSecretValue function
        getSecretValue: jest.fn().mockReturnValue({
          // Add a promise() function to getSecretValue, which returns what we want
          promise: jest.fn().mockResolvedValue({
            SecretString: '{"a": 1, "b": "hello world"}',
          }),
        }),
      };
    }),
  };
});

test("secret.getSecretContent returns a well-formatted secret content", async () => {
  expect.assertions(1);
  expect(await secret.getSecretContent("some/secret/name")).toEqual({
    a: 1,
    b: "hello world",
  });
});
