const tooGoodToGo = require("./tooGoodToGo");
const axios = require('axios')

jest.mock("axios")

test("tooGoodToGo.login", async () => {
  axios.mockImplementationOnce(() =>
      Promise.resolve({data: {items: [{id: "1234", items_available: 1}]}}),
    );
  expect.assertions(1);
  expect(
    await tooGoodToGo.getAvailableBaskets(1, 2, 5)
  ).toEqual([{id: "1234", items_available: 1}]);
});

test("tooGoodToGo.getAvailableBaskets", async () => {
  axios.mockImplementationOnce(() =>
      Promise.resolve({data: {items: [{id: "1234", items_available: 1}]}}),
    );
  expect.assertions(1);
  expect(
    await tooGoodToGo.getAvailableBaskets(1, 2, 5)
  ).toEqual([{id: "1234", items_available: 1}]);
});

test("tooGoodToGo.getAvailableBaskets", async () => {
  axios.mockImplementationOnce(() =>
      Promise.resolve({data: {items: [{id: "1234", items_available: 0}]}}),
    );
  expect.assertions(1);
  expect(
    await tooGoodToGo.getAvailableBaskets(1, 2, 5)
  ).toEqual([]);
});

test("tooGoodToGo.getAvailableBaskets", async () => {
  axios.mockImplementationOnce(() =>
      Promise.resolve({data: {items: [{id: "1234", items_available: 0}, {id: "5678", items_available: 1}]}}),
    );
  expect.assertions(1);
  expect(
    await tooGoodToGo.getAvailableBaskets(1, 2, 5)
  ).toEqual([{id: "5678", items_available: 1}]);
});