import * as U from "./utils";

test("check email", () => {
  expect(U.emailCheck("john@doe.com")).toEqual(undefined);
  expect(U.emailCheck("johndoe.com")).toEqual(["email invalid"]);
});

test("check password", () => {
  expect(U.passwordCheck("john@doe.com")).toEqual(undefined);
  expect(U.passwordCheck("jo")).toEqual(["password length smaller than 8"]);
});

test("check uuid", () => {
  expect(U.checkUuid("983aa206-a047-48b6-82b0-96873d9e4dd5")).toEqual(
    undefined
  );
  expect(U.checkUuid("jo")).toEqual(["uuid invalid"]);
});
