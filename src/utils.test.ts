import * as U from "./utils";

test("check email", () => {
  expect(U.emailCheck("john@doe.com")).toEqual(undefined);
  expect(U.emailCheck("johndoe.com")).toEqual(["email invalid"]);
  expect(U.emailCheck("tm8045@ch.ibm.com")).toEqual(undefined);
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

test("regex check", () => {
  const r: RegExp = /^My\d{3}$/;

  expect(U.regexCheck("My123", r)).toEqual(undefined);
  expect(U.regexCheck("My1234", r)).toEqual([
    "regex /^My\\d{3}$/ not satisfied",
  ]);
});

test("is id", () => {
  expect(U.checkId(12)).toEqual(undefined);
  expect(U.checkId(-1)).toEqual(["id must be greater than 0"]);
  expect(U.checkId(1.54)).toEqual(["id must be an integer"]);
});
