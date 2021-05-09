import * as M from "./main";
import * as T from "./type";

test("is object - optional set to false", () => {
  const shape: T.Shape = {
    firstName: {},
    myObj: { $object: { id: { type: "number" } }, optional: false },
  };

  const body = { firstName: "john", myObj: { id: 3 } };
  const m = M.checkObject(body, shape);

  expect(m).toEqual({});
});

test("is object - optional set to false - wrong input", () => {
  const shape: T.Shape = {
    firstName: {},
    myObj: { $object: { id: { type: "number" } }, optional: false },
  };

  const body = { firstName: "john", myObj: { id: "s" } };
  const m = M.checkObject(body, shape);

  expect(m).toEqual({ myObj: { id: ["expected type number"] } });
});

test("is object - optional", () => {
  const shape: T.Shape = {
    firstName: {},
    myObj: { $object: { id: { type: "number" } }, optional: true },
  };

  const body = { firstName: "john" };
  const m = M.checkObject(body, shape);

  expect(m).toEqual({});
});

test("dummy", () => {
  expect(true).toEqual(true);
});
