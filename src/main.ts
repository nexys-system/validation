import * as Utils from "./utils";
import * as T from "./type";

export const stringCheckAssign = (
  value: any,
  err: T.Error,
  keyLabel: string,
  optional: boolean = false, // by default field is mandatory
  extraCheck?: (s: string) => string[] | undefined,
  fieldType: T.FieldType = "string",
  errorLabel = "This field is required"
): boolean => {
  if (!value && optional === true) {
    return true;
  }

  if (value === null || value === undefined) {
    err[keyLabel] = [errorLabel];
    return false;
  }

  if (typeof value !== fieldType) {
    err[keyLabel] = ["expected type " + fieldType];
    return false;
  }

  if (extraCheck) {
    const e = extraCheck(value);

    if (e) {
      err[keyLabel] = e;
      return false;
    }
  }

  return true;
};

export const isShapeType = (
  s: T.ShapeCore | T.Shape | T.ShapeArray
): s is T.Shape => {
  const shapeCoreAttributes: (keyof T.ShapeCore)[] = [
    "optional",
    "extraCheck",
    "type",
    "errorLabel",
  ];

  const keys = Object.keys(s);

  return keys
    .map((k) => !(shapeCoreAttributes as string[]).includes(k))
    .reduce((x, y) => x || y, false);
};

export const isShapeArrayType = (
  s: T.ShapeCore | T.Shape | T.ShapeArray
): s is T.ShapeArray => {
  const keys = Object.keys(s);

  const r = keys.length === 1 && keys[0] === "$array";
  //console.log(s, r, keys[0]);
  return r;
};

/**
 *
 * @param input
 * @param shape : validation shape
 * @param err : error object
 * @param errorsIfExtraAttribute: add to the error object if extra args
 * @returns error object
 */
export const checkObject = (
  input: any,
  shape: T.Shape,
  errorsIfExtraAttribute: boolean = true
): T.Error => {
  if (!input) {
    throw Error("input needs to be undefined");
  }

  const err: T.Error = {};

  const oShape = Object.entries(shape);
  const shapeKeys: string[] = oShape.map(([k]) => k);

  // go through the keys of the input object and see if some are not included in the validation shape
  Object.keys(input).map((inputKey) => {
    if (!shapeKeys.includes(inputKey)) {
      // an unexpected key was not found. Removing it from the object
      delete input[inputKey];

      // if flag is on, add an error
      if (errorsIfExtraAttribute === true) {
        err[inputKey] = ["this key cannot be included"];
      }
    }
  });

  oShape.map(([k, v]) => {
    const inputUnit = input[k];

    if (isShapeArrayType(v)) {
      const w = v["$array"];

      if (!Array.isArray(inputUnit)) {
        err[k] = ["array expected"];
      } else {
        /* const r: T.Error =  checkObject(
          inputUnit || {},
          w,
          errorsIfExtraAttribute
        );

        if (Object.keys(r).length > 0) {
          err[k] = r;
        }*/
      }
    } else {
      if (isShapeType(v)) {
        const r = checkObject(inputUnit || {}, v, errorsIfExtraAttribute);
        if (Object.keys(r).length > 0) {
          err[k] = r;
        }
      } else {
        stringCheckAssign(
          inputUnit,
          err,
          k,
          v.optional,
          v.extraCheck,
          v.type,
          v.errorLabel
        );
      }
    }
  });

  return err;
};

// middleware for Koa

/**
 *
 * @param err error Objet to be displayed
 * @param ctx //Koa.Context
 * @returns
 */
export const displayErrors = (
  err: T.Error,
  ctx: any,
  statusCode: number = 400
) => {
  ctx.body = err;
  ctx.status = statusCode;
  return;
};

/**
 *
 * @param shape
 *
 * @param ctx//Koa.Context,
 * @param next // Koa.Next
 * @returns
 */
export const isShapeMiddleware = (
  shape: T.Shape,
  errorsIfExtraAttribute: boolean = true
) => async (ctx: any, next: any) => {
  const { body } = ctx.request;

  const err: T.Error = checkObject(body, shape, errorsIfExtraAttribute);

  if (Object.keys(err).length > 0) {
    displayErrors(err, ctx);
    return;
  }

  await next();
};

/**
 *
 * @param shape input expected Shape
 * @param body in Koa: ctx.request.body
 * @param ctx //Koa.Context,
 * @returns
 */
export const isShape = <A = any>(
  shape: T.Shape,
  body: any, // from
  ctx: any
): body is A => {
  const err: T.Error = checkObject(body, shape);

  if (Object.keys(err).length > 0) {
    displayErrors(err, ctx);
    return false;
  }

  return true;
};

export const isUuid = isShapeMiddleware({
  uuid: { extraCheck: Utils.checkUuid },
});

export const isId = isShapeMiddleware({
  id: { type: "number", extraCheck: Utils.checkId },
});
