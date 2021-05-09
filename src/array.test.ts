import * as M from "./main";
import { Shape } from "./type";
import * as U from "./utils";

test("is array - correct input", () => {
  const shape: Shape = {
    firstName: {},
    titles: { $array: { type: "boolean" } },
  };

  const body = { firstName: "john", titles: [true, false] };
  const m = M.checkObject(body, shape);

  expect(m).toEqual({});
});

test("is array - wrong input", () => {
  const shape: Shape = {
    firstName: {},
    titles: { $array: { type: "boolean" } },
  };

  const body = { firstName: "john", titles: [true, 4, "jk", false] };
  const m = M.checkObject(body, shape);

  expect(m).toEqual({
    titles: {
      "1": ["expected type boolean"],
      "2": ["expected type boolean"],
    },
  });
});

test("is array of objects - correct shape", () => {
  const shape: Shape = {
    firstName: {},
    titles: { $array: { name: {}, id: { type: "number" } } },
  };

  const body = {
    firstName: "john",
    titles: [
      { id: 1, name: "foo1" },
      { id: 2, name: "foo2" },
    ],
  };
  const m = M.checkObject(body, shape);

  expect(m).toEqual({});
});

test("is array of objects - wrong shape", () => {
  const shape: Shape = {
    firstName: {},
    titles: { $array: { name: {}, id: { type: "number" } } },
  };

  const body = {
    firstName: "john",
    titles: [
      { id: "fds", name: "foo1" },
      { id: 2, name: "foo2" },
    ],
  };
  const m = M.checkObject(body, shape);

  expect(m).toEqual({
    titles: {
      "0": {
        id: ["expected type number"],
      },
    },
  });
});

test("is array 2", () => {
  const shape: Shape = {
    firstName: {},
    titles: { $array: { type: "boolean" } },
  };

  const body = { firstName: "john", titles: true };
  const m = M.checkObject(body, shape);

  expect(m).toEqual({ titles: ["array expected"] });
});

test("is array - array of emails -valid", () => {
  const shape: Shape = {
    firstName: {},
    emails: { $array: { extraCheck: U.emailCheck } }, //, ,
  };

  const input = { firstName: "John", emails: ["john@doe.com"] };
  const m = M.checkObject(input, shape);

  expect(m).toEqual({});
});

test("is array - array of emails -invalid", () => {
  const shape: Shape = {
    firstName: {},
    emails: { $array: { extraCheck: U.emailCheck } },
  };

  const input = { firstName: "John", emails: ["john @doe.com"] };
  const m = M.checkObject(input, shape);

  expect(m).toEqual({ emails: { 0: ["email invalid"] } });
});

test("is array 3", () => {
  const shape: Shape = {
    firstName: {},
    titles: { $array: { type: "boolean" } },
  };

  const body = { firstName: "john", titles: true };
  const m = M.checkObject(body, shape);

  expect(m).toEqual({ titles: ["array expected"] });
});
