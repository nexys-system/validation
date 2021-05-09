import * as VT from "./type";
import NUtils from "@nexys/utils";

export const emailCheck = (email: string): VT.ErrorOut | undefined => {
  const tEmail = email.trim();

  if (tEmail !== email) {
    return ["email must not contain any whitespace (before or after)"];
  }

  if (!NUtils.string.isEmail(email)) {
    return ["email invalid"];
  }
};

export const checkUuid = (uuid: string): VT.ErrorOut | undefined => {
  if (!NUtils.string.isUUID(uuid)) {
    return ["uuid invalid"];
  }
};

export const passwordCheck = (password: string): VT.ErrorOut | undefined => {
  const r: string[] = [];
  if (password.length < 9) {
    r.push("password length smaller than 8");
  }

  return r.length > 0 ? r : undefined;
};

export const regexCheck = (
  s: string,
  regex: RegExp
): VT.ErrorOut | undefined => {
  const r = s.match(regex);

  if (r === null) {
    return [`regex ${regex} not satisfied`];
  }

  return;
};

export const checkInteger = (
  s: number,
  allowNegatives: boolean = false
): VT.ErrorOut | undefined => {
  if (!Number.isSafeInteger(s)) {
    return ["must be an integer"];
  }

  if (s < 0 && !allowNegatives) {
    return ["negative numbers are not accepted"];
  }

  return undefined;
};

export const checkId = (s: any): VT.ErrorOut | undefined => {
  const r = checkInteger(s);

  // map integer error messages to id specific
  if (r && r[0][0] === "n") {
    return ["id must be greater than 0"];
  }

  return r;
};
