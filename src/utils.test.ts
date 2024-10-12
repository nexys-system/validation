import { test, expect } from "bun:test";
import * as U from "./utils";

test("check email", () => {
  expect(U.emailCheck("john@doe.com")).toEqual(undefined as any);
  expect(U.emailCheck("johndoe.com")).toEqual(["email invalid"]);
  expect(U.emailCheck("tm8045@ch.ibm.com")).toEqual(undefined as any);
  expect(U.emailCheck(" tm8045@ch.ibm.com")).toEqual([
    "email must not contain any whitespace (before or after)",
  ]);
});

test("check password", () => {
  expect(U.passwordCheck("john@doe.com")).toEqual(undefined as any);
  expect(U.passwordCheck("jo")).toEqual(["password length smaller than 8"]);
});

test("check uuid", () => {
  expect(U.checkUuid("983aa206-a047-48b6-82b0-96873d9e4dd5")).toEqual(
    undefined as any
  );
  expect(U.checkUuid("jo")).toEqual(["uuid invalid"]);
});

test("regex check", () => {
  const r: RegExp = /^My\d{3}$/;

  expect(U.regexCheck(r)("My123")).toEqual(undefined as any);
  expect(U.regexCheck(r)("My1234")).toEqual([
    "regex /^My\\d{3}$/ not satisfied",
  ]);
});

test("is id", () => {
  expect(U.checkId(12)).toEqual(undefined as any);
  expect(U.checkId(-1)).toEqual(["id must be greater than 0"]);
  expect(U.checkId(1.54)).toEqual(["must be an integer"]);
});

test("is integer", () => {
  expect(U.checkInteger(12)).toEqual(undefined as any);
  expect(U.checkInteger(12.3)).toEqual(["must be an integer"]);
  expect(U.checkInteger(-12)).toEqual(["negative numbers are not accepted"]);
});

test("check JSON", () => {
  // Valid JSON strings
  expect(U.checkJSON('{"name": "John", "age": 30}')).toEqual(undefined as any);
  expect(U.checkJSON("[1, 2, 3, 4]")).toEqual(undefined as any);
  expect(U.checkJSON('"This is a valid JSON string"')).toEqual(
    undefined as any
  );

  // Invalid JSON strings
  expect(U.checkJSON('{name: "John", age: 30}')).toEqual(["must be a JSON"]);
  expect(U.checkJSON("[1, 2, 3, 4")).toEqual(["must be a JSON"]);
  expect(U.checkJSON("Invalid JSON")).toEqual(["must be a JSON"]);
});
