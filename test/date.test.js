const date = require("../utils/date");

const dateValidityCheck = [
  {
    start: "12:00",
    end: "14:00",
  },
  {
    start: "16:30",
    end: "19:00",
  },
  {
    start: "21:00",
    end: "22:00",
  },
];

test("date.dateIsValid", () => {
  expect(
    date.dateIsValid(new Date("2020-10-20T13:00:00"), dateValidityCheck)
  ).toBe(true);
  expect(
    date.dateIsValid(new Date("2020-10-20T12:00:00"), dateValidityCheck)
  ).toBe(true);
  expect(
    date.dateIsValid(new Date("2020-10-20T13:59:59"), dateValidityCheck)
  ).toBe(true);
  expect(
    date.dateIsValid(new Date("2020-10-20T11:59:59"), dateValidityCheck)
  ).toBe(false);
  expect(
    date.dateIsValid(new Date("2020-10-20T14:00:00"), dateValidityCheck)
  ).toBe(false);
});

test("date.canBeNotified", () => {
  expect(
    date.canBeNotified(+new Date("2020-10-20T15:00:00"), +new Date("2020-10-20T14:00:00"))
  ).toBe(true);
  expect(
    date.canBeNotified(+new Date("2020-10-20T15:00:00"), +new Date("2020-10-20T13:00:00"))
  ).toBe(true);
  expect(
    date.canBeNotified(+new Date("2020-10-20T15:00:00"), +new Date("2020-10-20T12:45:39"))
  ).toBe(true);
  expect(
    date.canBeNotified(+new Date("2020-10-21T00:45:00"), +new Date("2020-10-20T23:45:00"))
  ).toBe(true);
  expect(
    date.canBeNotified(+new Date("2020-10-20T15:00:00"), +new Date("2020-10-20T15:00:00"))
  ).toBe(false);
  expect(
    date.canBeNotified(+new Date("2020-10-20T15:00:00"), +new Date("2020-10-20T15:00:01"))
  ).toBe(false);
  expect(
    date.canBeNotified(+new Date("2020-10-21T00:15:00"), +new Date("2020-10-20T23:45:00"))
  ).toBe(false);
});

test("date.wasLessThanXHoursAgo", () => {
  expect(
    date.wasLessThanXHoursAgo(+new Date("2020-10-20T15:00:00"), +new Date("2020-10-20T14:59:59"), 1)
  ).toBe(true);
  expect(
    date.wasLessThanXHoursAgo(+new Date("2020-10-20T15:00:00"), +new Date("2020-10-20T14:00:01"), 1)
  ).toBe(true);
  expect(
    date.wasLessThanXHoursAgo(+new Date("2020-10-21T00:15:00"), +new Date("2020-10-20T23:45:00"), 1)
  ).toBe(true);
  expect(
    date.wasLessThanXHoursAgo(+new Date("2020-10-20T15:00:00"), +new Date("2020-10-20T14:00:00"), 1)
  ).toBe(false);
  expect(
    date.wasLessThanXHoursAgo(+new Date("2020-10-20T15:00:00"), +new Date("2020-10-20T13:00:00"), 1)
  ).toBe(false);
  expect(
    date.wasLessThanXHoursAgo(+new Date("2020-10-20T15:00:00"), +new Date("2020-10-19T13:00:00"), 25)
  ).toBe(false);
  expect(
    date.wasLessThanXHoursAgo(+new Date("2020-10-20T15:00:00"), +new Date("2020-10-19T14:30:00"), 1)
  ).toBe(false);
});
