const sns = require("./sns");

beforeEach(() => {
  process.env.STAGE = "test";
});

// Mock AWS SDK
jest.mock("aws-sdk", () => {
  return {
    // Mock SNS constructor
    SNS: jest.fn(() => {
      return {
        // In SNS, mock publish function
        publish: jest.fn().mockReturnValue({
          // Add a promise() function to publish, which returns what we want
          promise: jest.fn().mockResolvedValue(true),
        }),
      };
    }),
  };
});

test("dynamo.updateDetailedCooldown", async () => {
  expect.assertions(1);
  expect(await sns.publishAvailableBaskets("abcd@gmail.com", 3)).toBe(true);
});
