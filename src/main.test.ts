import * as M from "./main";
import { Shape } from "./type";

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
    const input = { profile: { firstName: "fd", lastName: "bla" } };
    const subShape: Shape = { firstName: {}, lastName: {} };
    const shape: Shape = { email: {}, profile: subShape };
    expect(M.checkObject(input, shape)).toEqual({
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
  };

  const body = { firstName: "john" };
  const is = M.isShape<{ firstName: string }>(shape, body, {});

  expect(is).toEqual(true);
});
