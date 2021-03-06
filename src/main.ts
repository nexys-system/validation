import * as Utils from "./utils";
import * as T from "./type";

export const checkField = (
  value: any,
  optional: boolean = false, // by default field is mandatory
  extraCheck?: (s: string) => string[] | undefined,
  fieldType: T.FieldType = "string",
  errorLabel = "This field is required",
  allowEmptyString: boolean = false
): string[] | undefined => {
  // handle values that are not present, null, undefined
  if (
    value === null ||
    value === undefined ||
    (!allowEmptyString && typeof value === "string" && value === "")
  ) {
    // if optional is allowed, return true and stop
    if (optional === true) {
      return undefined;
    }
    // else add error
    return [errorLabel];
  }

  // check for value type
  if (typeof value !== fieldType) {
    return ["expected type " + fieldType];
  }

  // extra check
  if (extraCheck) {
    const e = extraCheck(value);

    if (e) {
      return e;
    }
  }

  return undefined;
};

const shapeCoreAttributes: (keyof T.ShapeCore)[] = [
  "optional",
  "extraCheck",
  "type",
  "errorLabel",
  "defaultValue",
  "$object",
  "$array",
  "allowEmptyString",
];

/**
 * decide between Shape or ShapeCore
 * @param s : shape | shape core
 * @returns boolean
 * @note this could actually be done using the validation
 */
export const isShapeType = (
  s: T.ShapeCore | T.Shape //| T.ShapeArray
): s is T.Shape =>
  Object.keys(s)
    .map((k) => !(shapeCoreAttributes as string[]).includes(k))
    .reduce((x, y) => x || y, false);

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
): T.Error | T.ErrorOut => {
  //console.log(input);
  if (!input) {
    throw Error("input needs to be defined");
  }

  let err: T.Error | T.ErrorOut = {};

  const oShape = Object.entries(shape);
  const shapeKeys: string[] = oShape.map(([k]) => k);
  // console.log(input, oShape);

  // go through the keys of the input object and see if some are not included in the validation shape, in which case it is either deleted or an error is added
  if (!Array.isArray(input)) {
    Object.keys(input).map((inputKey) => {
      if (!shapeKeys.includes(inputKey)) {
        // an unexpected key was found. Removing it from the object
        delete input[inputKey];

        // if flag is on, add an error
        if (errorsIfExtraAttribute === true) {
          (err as T.Error)[inputKey] = ["this key cannot be included"];
        }
      }
    });
  }

  //console.log(input);
  // go through the elements of the shape object
  oShape.map(([shapeKey, shapeValue]) => {
    const inputUnit = input[shapeKey];
    //  console.log(input, inputUnit);

    // handles nested object
    if (isShapeType(shapeValue)) {
      const r = checkObject(
        inputUnit || {},
        shapeValue,
        errorsIfExtraAttribute
      );
      if (Object.keys(r).length > 0) {
        (err as T.Error)[shapeKey] = r;
      }
    } else {
      const { $object: obj, $array: arr } = shapeValue;

      // general check
      // - null/undefined
      // - correct type

      const fieldType = shapeValue.type || (obj || arr ? "object" : undefined);

      //console.log(shapeValue, inputUnit, arr, !!arr);

      const fieldError = checkField(
        inputUnit,
        shapeValue.optional,
        shapeValue.extraCheck,
        fieldType,
        shapeValue.errorLabel
      );

      if (fieldError) {
        (err as T.Error)[shapeKey] = fieldError;
      }

      // assign default value
      if (inputUnit === undefined && shapeValue.defaultValue) {
        input[shapeKey] = shapeValue.defaultValue;
      }

      // handle $object

      if (obj) {
        //console.log("j");
        //console.log(input, shapeKey, inputUnit);

        const shape = obj as T.Shape;

        if (inputUnit) {
          const r = checkObject(inputUnit || {}, shape, errorsIfExtraAttribute);
          if (Object.keys(r).length > 0) {
            (err as T.Error)[shapeKey] = r;
          }
        }
      } else if (arr && inputUnit) {
        /*console.log(
          "array",
          arr,
          shapeKey,
          shapeValue,
          JSON.stringify(input),
          inputUnit
        );*/

        const shape = arr as T.Shape;

        if (!Array.isArray(inputUnit)) {
          (err as T.Error)[shapeKey] = ["array expected"];
        } else {
          // input is an array, go through the array
          inputUnit.forEach((inputUnit, arrayIdx) => {
            //console.log({ type: isShapeType(shape), inputUnit, shapeValue });
            if (!isShapeType(shape)) {
              const r = checkField(
                inputUnit,
                (shape as T.ShapeCore).optional,
                (shape as T.ShapeCore).extraCheck,
                (shape as T.ShapeCore).type,
                (shape as T.ShapeCore).errorLabel
              );

              if (r) {
                if (!(err as T.Error)[shapeKey]) {
                  (err as T.Error)[shapeKey] = {};
                } //
                ((err as T.Error)[shapeKey] as T.Error)[arrayIdx] = r;
              }
            } else {
              // console.log("todo, when object in array");
              const r = checkObject(
                inputUnit || {},
                shape,
                errorsIfExtraAttribute
              );
              if (Object.keys(r).length > 0) {
                if (!(err as T.Error)[shapeKey]) {
                  (err as T.Error)[shapeKey] = {};
                } //
                ((err as T.Error)[shapeKey] as T.Error)[arrayIdx] = r;
              }
            }
          });
        }
      } else {
        // handle non object/array

        const fieldError = checkField(
          inputUnit,
          shapeValue.optional,
          shapeValue.extraCheck,
          shapeValue.type,
          shapeValue.errorLabel,
          shapeValue.allowEmptyString
        );

        if (fieldError) {
          (err as T.Error)[shapeKey] = fieldError;
        }
      }

      // assign default value
      if (inputUnit === undefined && shapeValue.defaultValue) {
        input[shapeKey] = shapeValue.defaultValue;
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
  err: T.Error | T.ErrorOut,
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
export const isShapeMiddleware =
  (shape: T.Shape, errorsIfExtraAttribute: boolean = true) =>
  async (ctx: any, next: any) => {
    const { body } = ctx.request;

    const err: T.Error | T.ErrorOut = checkObject(
      body,
      shape,
      errorsIfExtraAttribute
    );

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
  const err: T.Error | T.ErrorOut = checkObject(body, shape);

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
