/*test("is object - optional todo", () => {
  const shape: Shape = {
    firstName: {},
    myObj: { id: { type: "number" }, optional: true },
  };

  const body = { firstName: "john", myObj: { id: 3 } };
  const m = M.checkObject(body, shape);

  expect(m).toEqual({});
});*/

test("dummy", () => {
  expect(true).toEqual(true);
});
