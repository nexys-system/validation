import * as M from "./main";
import { Shape } from "./type";
import * as VU from "./utils";

describe("checkObject", () => {
  test("undefined object", () => {
    const input = undefined;
    const shape = { email: {} };

    try {
      M.checkObject(input, shape);
    } catch (e) {
      expect(e.message).toEqual("input needs to be undefined");
    }
  });

  test("empty object", () => {
    const input = {};
    const shape = { email: {} };
    expect(M.checkObject(input, shape)).toEqual({
      email: ["This field is required"],
    });
  });

  test("empty object", () => {
    const input1 = { age: 23 };
    const shape: Shape = { age: { type: "number" } };
    expect(M.checkObject(input1, shape)).toEqual({});

    const input2 = { age: "23" };
    expect(M.checkObject(input2, shape)).toEqual({
      age: ["expected type number"],
    });
  });

  test("optional attribute", () => {
    const input1 = {};
    const shape: Shape = {
      email: {},
      firstName: {
        optional: true,
        extraCheck: (s: string): string[] | undefined =>
          s.length > 3 ? ["at least 3 char long"] : undefined,
      },
    };
    expect(M.checkObject(input1, shape)).toEqual({
      email: ["This field is required"],
    });

    const input2 = { firstName: "john" };
    expect(M.checkObject(input2, shape)).toEqual({
      email: ["This field is required"],
      firstName: ["at least 3 char long"],
    });
  });

  test("nested object", () => {
    const input = {
      profile: { firstName: "John", lastName: "Doe", middleName: "myMiddle" },
    };
    const subShape: Shape = { firstName: {}, lastName: {} };
    const shape: Shape = { email: {}, profile: subShape };
    const r = M.checkObject(input, shape);

    // in this case, an extra params was added (middle name), make sure that it was removed from object after validation
    expect(input.profile.middleName).toEqual(undefined);

    expect(r).toEqual({
      email: ["This field is required"],
      profile: { middleName: ["this key cannot be included"] },
    });
  });

  test("nested object - does not display extra error", () => {
    const input = {
      profile: { firstName: "John", lastName: "Doe", middleName: "myMiddle" },
    };
    const subShape: Shape = { firstName: {}, lastName: {} };
    const shape: Shape = { email: {}, profile: subShape };
    const r = M.checkObject(input, shape, false);

    // in this case, an extra params was added (middle name), make sure that it was removed from object after validation
    expect(input.profile.middleName).toEqual(undefined);

    expect(r).toEqual({
      email: ["This field is required"],
    });
  });

  test("nested object 2", () => {
    const input = { profile: { firstName: "fd" } };
    const subShape: Shape = { firstName: {}, lastName: {} };
    const shape: Shape = { email: {}, profile: subShape };
    expect(M.checkObject(input, shape)).toEqual({
      email: ["This field is required"],
      profile: {
        lastName: ["This field is required"],
      },
    });
  });

  test("nested object 3", () => {
    const input = {};
    const subShape: Shape = {
      firstName: { errorLabel: "First name is required" },
      lastName: {},
    };
    const shape: Shape = { email: {}, profile: subShape };
    expect(M.checkObject(input, shape)).toEqual({
      email: ["This field is required"],
      profile: {
        firstName: ["First name is required"],
        lastName: ["This field is required"],
      },
    });
  });
});

test("is shape", () => {
  const shape: Shape = {
    firstName: {},
    isRick: { type: "boolean" },
  };

  const body = { firstName: "john", isRick: false };
  const is = M.isShape<{ firstName: string }>(shape, body, {});

  expect(is).toEqual(true);
});

test("is shape array", () => {
  expect(M.isShapeArrayType({ $array: {} })).toEqual(true);
  expect(M.isShapeArrayType({})).toEqual(false);
});

test("is array", () => {
  const shape: Shape = {
    firstName: {},
    titles: { $array: { type: "boolean" } },
  };

  const body = { firstName: "john", titles: [true] };
  const m = M.checkObject(body, shape);

  expect(m).toEqual({});
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

describe("sample", () => {
  const shape: Shape = {
    id: { type: "number" },
  };

  test("test1", () => {
    const input = { id: 4 };

    const is = M.checkObject(input, shape);

    expect(is).toEqual({});
  });

  test("test2", () => {
    const input = { id: "4" };

    const is = M.checkObject(input, shape);

    expect(is).toEqual({ id: ["expected type number"] });
  });

  test("test3", () => {
    const shape: Shape = {
      id: {
        type: "number",
        extraCheck: (s: any) => {
          if (s < 10) {
            return ["id must be greater than 10"];
          }
          return undefined;
        },
      },
    };

    const input = { id: 4 };
    const is = M.checkObject(input, shape);

    expect(is).toEqual({ id: ["id must be greater than 10"] });
  });

  test("test4 optional", () => {
    const shape: Shape = {
      id: {
        type: "number",
        optional: true,
      },
    };

    const input = {};
    const is = M.checkObject(input, shape);

    expect(is).toEqual({});
  });

  test("test5 too many attributes", () => {
    const shape: Shape = {
      id: {
        type: "number",
      },
    };

    const input = { id: 4, name: "Jane" };
    const is = M.checkObject(input, shape);

    expect(is).toEqual({ name: ["this key cannot be included"] });
  });
});
