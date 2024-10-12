import { describe, expect, test } from "bun:test";
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

describe("isInSet function", () => {
  test("returns undefined when input is in the set", () => {
    const validSet = new Set(["apple", "banana", "cherry"]);
    const result = U.isInSetCheck(validSet)("apple");
    expect(result).toBeUndefined();
  });

  test("returns an error message when input is not in the set", () => {
    const validSet = new Set(["apple", "banana", "cherry"]);
    const result = U.isInSetCheck(validSet)("orange");
    expect(result).toEqual([`input "orange" is not in the set`]);
  });

  test("returns an error message when the set is empty", () => {
    const emptySet = new Set<string>();
    const result = U.isInSetCheck(emptySet)("anything");
    expect(result).toEqual([`input "anything" is not in the set`]);
  });

  test("returns undefined when input exists in a set of numbers", () => {
    const numberSet = new Set([1, 2, 3]);
    const result = U.isInSetCheck(numberSet)("2");
    expect(result).toEqual(['input "2" is not in the set']); // Because '2' is a sring and 2 in the set is an int/number
  });

  test("returns an error message when input does not match any number in the set", () => {
    const numberSet = new Set([1, 2, 3]);
    const result = U.isInSetCheck(numberSet)("4");
    expect(result).toEqual([`input "4" is not in the set`]);
  });

  test("works with mixed types (e.g., string and number)", () => {
    const mixedSet = new Set([1, "apple", 3, "banana"]);
    expect(U.isInSetCheck(mixedSet)("apple")).toBeUndefined();
    expect(U.isInSetCheck(mixedSet)("1")).toEqual([
      `input "1" is not in the set`,
    ]);
  });
});
