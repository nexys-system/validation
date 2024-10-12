import * as VT from "./type";

// compare with note: taken from https://github.com/Nexysweb/utils/blob/master/src/string.ts#L159

/**
 * Checks if the input string is a valid email.
 * @param   email - The email string to validate.
 * @return  `true` if the email is valid, `false` otherwise.
 * @see     https://stackoverflow.com/questions/13912597/validate-email-one-liner-in-scala/32445372#32445372
 * @see     http://www.w3.org/TR/html5/forms.html#valid-e-mail-address
 */
const isEmail = (email: string): boolean => {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i;
  const regexResult = email.match(emailRegex);

  return !!regexResult && regexResult.includes(email);
};

/**
 * Checks if the input string is a valid UUID.
 * @param  str - The UUID string to validate.
 * @param  version - The UUID version to validate against. Can be 'all', '3', '4', or '5'.
 * @return `true` if the UUID is valid for the specified version, `false` otherwise.
 * @see    https://github.com/validatorjs/validator.js/blob/master/src/lib/isUUID.js
 */
export const isUUID = (
  str: string,
  version: 3 | 4 | 5 | "all" = "all"
): boolean => {
  const patterns = {
    3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
    4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  };

  const pattern = patterns[version];
  return pattern && pattern.test(str);
};

/**
 * Validates an email address and returns an error message if invalid.
 * @param  email - The email string to validate.
 * @return An array of error messages, or `undefined` if the email is valid.
 */
export const emailCheck = (email: string): VT.ErrorOut | undefined => {
  const tEmail = email.trim();

  if (tEmail !== email) {
    return ["email must not contain any whitespace (before or after)"];
  }

  if (!isEmail(email)) {
    return ["email invalid"];
  }
};

/**
 * Validates a UUID and returns an error message if invalid.
 * @param  uuid - The UUID string to validate.
 * @return An array of error messages, or `undefined` if the UUID is valid.
 */
export const checkUuid = (uuid: string): VT.ErrorOut | undefined => {
  if (!isUUID(uuid)) {
    return ["uuid invalid"];
  }
};

/**
 * Validates a password and returns an error message if it does not meet the required criteria.
 * @param  password - The password string to validate.
 * @return An array of error messages, or `undefined` if the password is valid.
 */
export const passwordCheck = (password: string): VT.ErrorOut | undefined => {
  const r: string[] = [];
  if (password.length < 9) {
    r.push("password length smaller than 8");
  }

  return r.length > 0 ? r : undefined;
};

/**
 * Validates a string against a given regular expression and returns an error message if it does not match.
 * @param  s - The string to validate.
 * @param  regex - The regular expression to test against.
 * @return An array of error messages, or `undefined` if the string satisfies the regex.
 */
export const regexCheck =
  (regex: RegExp) =>
  (s: string): VT.ErrorOut | undefined => {
    const r = s.match(regex);

    if (r === null) {
      return [`regex ${regex} not satisfied`];
    }

    return;
  };

// Function that checks if the input string exists in a provided Set
export const isInSetCheck =
  <A>(inputSet: Set<A>) =>
  (input: string): VT.ErrorOut | undefined => {
    // Check if the input string exists in the set (casting input as A, since Set<A> expects type A)
    if (!inputSet.has(input as unknown as A)) {
      // Return an error message in an array if input is not in the set
      return [`input "${input}" is not in the set`];
    }

    // Return undefined if input is valid (i.e., exists in the set)
  };

/**
 * Validates if a number is an integer and optionally if it can be negative.
 * @param  s - The number to validate.
 * @param  allowNegatives - Whether negative numbers are allowed (default: `false`).
 * @return An array of error messages, or `undefined` if the number is a valid integer.
 */
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

/**
 * Validates an ID by checking if it is a positive integer.
 * @param  s - The ID to validate.
 * @return An array of error messages, or `undefined` if the ID is valid.
 */
export const checkId = (s: any): VT.ErrorOut | undefined => {
  const r = checkInteger(s);

  // Map integer error messages to ID-specific errors
  if (r && r[0][0] === "n") {
    return ["id must be greater than 0"];
  }

  return r;
};

const monthW30Days = [4, 6, 9, 11];

/**
 * Validates a date string in ISO 8601 format (YYYY-MM-DD).
 * @param  s - The date string to validate.
 * @param  options - Optional configuration for minimum and maximum year.
 * @return An array of error messages, or `undefined` if the date is valid.
 * @see    https://en.wikipedia.org/wiki/ISO_8601
 */
export const checkISODateFormat = (
  s: string,
  options: Partial<{ yearMin: number; yearMax: number }> = {}
): VT.ErrorOut | undefined => {
  const r = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (r === null || r.length < 4) {
    return ["date format not accepted, please pass YYYY-MM-DD"];
  }

  const [, year, month, day] = r;

  const iDay = parseInt(day);
  const iMonth = parseInt(month);
  const iYear = parseInt(year);

  const errors: string[] = [];

  const { yearMin = 1900, yearMax = 2300 } = options;

  if (iDay < 1) {
    errors.push("day must be greater than zero");
  }

  if (iMonth < 1) {
    errors.push("month must be greater than zero");
  }

  if (iMonth > 12) {
    errors.push("month must be smaller than 12");
  }

  if (iYear < yearMin) {
    errors.push("year must be greater than " + yearMin);
  }

  if (iYear > yearMax) {
    errors.push("year must be smaller than " + yearMax);
  }

  const isLeapYear = Math.abs(1988 - iYear) % 4 === 0;

  if (iMonth === 2) {
    if (!isLeapYear && iDay > 28) {
      errors.push("day must be smaller than 28 (February)");
    }

    if (isLeapYear && iDay > 29) {
      errors.push("day must be smaller than 29 (February and leap year)");
    }
  } else {
    if (monthW30Days.includes(iMonth) && iDay > 30) {
      errors.push(`day must be smaller than 30 (month of ${iMonth})`);
    } else {
      if (iDay > 31) {
        errors.push("day must be smaller than 31");
      }
    }
  }

  if (errors.length > 0) {
    return errors;
  }

  return undefined;
};

/**
 * Validates if a string is a valid JSON.
 * @param  s - The string to validate.
 * @return An array of error messages, or `undefined` if the string is a valid JSON.
 */
export const checkJSON = (s: string): VT.ErrorOut | undefined => {
  try {
    JSON.parse(s);
    return undefined;
  } catch (err) {
    return ["must be a JSON"];
  }
};
