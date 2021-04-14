import * as VT from "./type";
import NUtils from "@nexys/utils";

export const emailCheck = (email: string): VT.ErrorOut | undefined => {
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
