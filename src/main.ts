import * as T from "./type";

const stringCheckAssign = (
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

  if (!value) {
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

const displayErrors = (err: T.Error, ctx: any) => {
  //Koa.Context
  if (Object.keys(err).length > 0) {
    ctx.body = err;
    ctx.status = 400;
    return;
  }
};

export const isShapeMiddleware = (shape: T.Shape) => (
  ctx: any, //Koa.Context,
  next: any //Koa.Next
) => {
  const { body } = ctx.request;

  const err: T.Error = checkObject(body, shape);

  if (Object.keys(err).length > 0) {
    displayErrors(err, ctx);
    return;
  }

  next();
};

export const isShape = <A = any>(
  shape: T.Shape,
  body: any,
  ctx: any
): body is A => {
  const err: T.Error = checkObject(body, shape);

  if (Object.keys(err).length > 0) {
    displayErrors(err, ctx);
    return false;
  }

  return true;
};

const isShapeType = (s: T.ShapeCore | T.Shape): s is T.Shape => {
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

export const checkObject = (
  input: any,
  shape: T.Shape,
  err: T.Error = {}
): T.Error => {
  if (!input) {
    throw Error("input needs to be undefined");
  }

  Object.entries(shape).map(([k, v]) => {
    const inputUnit = input[k];

    if (isShapeType(v)) {
      const r = checkObject(inputUnit || {}, v);
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
  });

  return err;
};
