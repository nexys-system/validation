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

export const checkId = (s: any): VT.ErrorOut | undefined => {
  if (s <= 0) {
    return ["id must be greater than 0"];
  }

  if (s % 1 !== 0) {
    return ["id must be an integer"];
  }

  return;
};
