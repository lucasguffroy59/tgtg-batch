const dynamo = require("./dynamo");

// Mock AWS SDK
jest.mock("aws-sdk", () => {
  return {
    DynamoDB: {
      // In DynamoDB, mock DocumentClient constructor
      DocumentClient: jest.fn(() => {
        return {
          // In DocumentClient, mock scan function
          scan: jest.fn().mockReturnValue({
            // Add a promise() function to scan, which returns what we want
            promise: jest.fn().mockResolvedValue({
              Items: [{ hello: "world" }],
            }),
          }),
          // In DocumentClient, mock update function
          update: jest.fn().mockReturnValue({
            // Add a promise() function to update, which returns what we want
            promise: jest.fn().mockResolvedValue(true),
          }),
        };
      }),
    },
  };
});

test("dynamo.getAllUserInfo", async () => {
  expect.assertions(1);
  expect(await dynamo.getAllUserInfo()).toEqual([{ hello: "world" }]);
});

test("dynamo.updateBasicCooldown", async () => {
  expect.assertions(1);
  expect(await dynamo.updateBasicCooldown("abcd@gmail.com")).toBe(true);
});

test("dynamo.updateDetailedCooldown", async () => {
  expect.assertions(1);
  expect(
    await dynamo.updateDetailedCooldown("abcd@gmail.com", ["aStore"])
  ).toBe(true);
});
