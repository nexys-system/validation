import * as VT from "./type";

/**
 * note: taken from https://github.com/Nexysweb/utils/blob/master/src/string.ts#L159
 * (no need to import all module just for a handful of functions)
 * checks if input string is an email
 * @param   email
 * @return true/false
 * @see  https://stackoverflow.com/questions/13912597/validate-email-one-liner-in-scala/32445372#32445372
 * @see  http://www.w3.org/TR/html5/forms.html#valid-e-mail-address
 */
const isEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9\.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i;

  const regexResult = email.match(emailRegex);

  if (!regexResult) {
    return false;
  }

  return regexResult.includes(email);
};

/**
 * note: taken from https://github.com/Nexysweb/utils/blob/master/src/string.ts#L186
 * (no need to import all module just for a handful of functions)
 * checks if input string is a valid UUID
 * @param  {[type]} str     input UUID/string
 * @param  {String} version UUID type: {'all', '3', '4' ,'5'}
 * @return {[type]}         boolean
 *
 * taken from: https://github.com/validatorjs/validator.js/blob/master/src/lib/isUUID.js
 */
 export const isUUID = (
  str: string,
  version: 3 | 4 | 5 | "all" = "all"
): Boolean => {
  const patterns = {
    3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
    4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  };

  const pattern = patterns[version];
  return pattern && pattern.test(str);
};

export const emailCheck = (email: string): VT.ErrorOut | undefined => {
  const tEmail = email.trim();

  if (tEmail !== email) {
    return ["email must not contain any whitespace (before or after)"];
  }

  if (!isEmail(email)) {
    return ["email invalid"];
  }
};

export const checkUuid = (uuid: string): VT.ErrorOut | undefined => {
  if (!isUUID(uuid)) {
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

const monthW30Days = [4, 6, 9, 11];

/**
 * check ISO date format (YYYY-MM-DD)
 * @see https://en.wikipedia.org/wiki/ISO_8601
 */
export const checkISODateFormat = (
  s: string,
  options: Partial<{ yearMin: number; yearMax: number }> = {}
): VT.ErrorOut | undefined => {
  const r = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (r === null || r.length < 4) {
    return ['date format not accepted, please pass YYYY-MM-DD'];
  }

  const [, year, month, day] = r;

  const iDay = parseInt(day);
  const iMonth = parseInt(month);
  const iYear = parseInt(year);

  const errors: string[] = [];

  const { yearMin = 1900, yearMax = 2300 } = options;

  if (iDay < 1) {
    errors.push('day must be greater than zero');
  }

  if (iMonth < 1) {
    errors.push('month must be greater than zero');
  }

  if (iMonth > 12) {
    errors.push('month must be smaller than 12');
  }

  if (iYear < yearMin) {
    errors.push('year must be greater than ' + yearMin);
  }

  if (iYear > yearMax) {
    errors.push('year must be smaller than ' + yearMax);
  }

  const isLeapYear = Math.abs(1988 - iYear) % 4 === 0;

  if (iMonth === 2) {
    if (!isLeapYear && iDay > 28) {
      errors.push('day must be smaller than 28 (feburary)');
    }

    if (isLeapYear && iDay > 29) {
      errors.push('day must be smaller than 29 (february and leap year)');
    }
  } else {
    if (monthW30Days.includes(iMonth) && iDay > 30) {
      errors.push(`day must be smaller than 30 (month of ${iMonth})`);
    } else {
      if (iDay > 31) {
        errors.push('day must be smaller than 31');
      }
    }
  }

  if (errors.length > 0) {
    return errors;
  }

  return undefined;
};
