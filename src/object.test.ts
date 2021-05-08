import * as M from "./main";
import * as T from "./type";

test("is object - optional todo", () => {
  const shape: T.Shape = {
    firstName: {},
    myObj: { $object: { id: { type: "number" } }, optional: true },
  };

  const body = { firstName: "john", myObj: { id: 3 } };
  const m = M.checkObject(body, shape);

  expect(m).toEqual({});
});

test("dummy", () => {
  expect(true).toEqual(true);
});
