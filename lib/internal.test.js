const internal = require("./internal");

test("internal.canBeNotified", () => {
  expect(
    internal.canBeNotified(
      new Date("2020-10-20T15:00:00"),
      ["aStore"],
      [{ storeId: "aStore", date: +new Date("2020-10-18T15:00:00") }]
    )
  ).toBe(true);
  expect(
    internal.canBeNotified(
      new Date("2020-10-20T15:00:00"),
      ["aStore"],
      [{ storeId: "anotherStore", date: +new Date("2020-10-20T14:00:00") }]
    )
  ).toBe(true);
  expect(
    internal.canBeNotified(
      new Date("2020-10-20T15:00:00"),
      ["aStore", "anotherStore"],
      [{ storeId: "yetAnotherStore", date: +new Date("2020-10-20T14:00:00") }]
    )
  ).toBe(true);
  expect(
    internal.canBeNotified(
      new Date("2020-10-20T15:00:00"),
      ["aStore", "anotherStore"],
      [
        { storeId: "aStore", date: +new Date("2020-10-20T14:00:00") },
        { storeId: "anotherStore", date: +new Date("2020-10-18T14:00:00") },
      ]
    )
  ).toBe(false);
  expect(
    internal.canBeNotified(
      new Date("2020-10-20T15:00:00"),
      ["aStore"],
      [{ storeId: "aStore", date: +new Date("2020-10-20T14:00:00") }]
    )
  ).toBe(false);
});
