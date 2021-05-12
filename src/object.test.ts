import * as M from "./main";
import * as T from "./type";
import * as U from "./utils";

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

test("is object - optional nested", () => {
  const shape: T.Shape = {
    firstName: {},
    myObj: {
      id: { type: "number" },
      obj: { $object: { id: { type: "number" } }, optional: true },
    },
  };

  const body = { firstName: "john", myObj: { id: 4, obj: { id: 4 } } };
  const m = M.checkObject(body, shape);

  expect(m).toEqual({});
});

test('generic object - optional', () => {
  const shape: T.Shape = {
    uuid: { extraCheck: U.checkUuid },
    params: { type: "object", optional: true },
    data: { type: "object", optional: true },
  };
  
  const input = {uuid: 'ef04fafc-af19-11eb-847c-42010aac003d'};
  
  const m = M.checkObject(input, shape);

  expect(m).toEqual({});
})
