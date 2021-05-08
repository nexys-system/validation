export type ErrorOut = string[];

export type Error = { [k: string]: ErrorOut | Error };

export type FieldType = "string" | "number" | "boolean" | "object";

export interface ShapeCore {
  optional?: boolean;
  //$optional?: boolean; // this is an alias for optional, especially relevant for nested objects
  type?: FieldType;
  extraCheck?: (s: string) => string[] | undefined; // here " | undefined " is used instead of "?" because of the signature of extraCheck
  errorLabel?: string;
  defaultValue?: string; // todo change to any
}

export type ShapeLinear = {
  name: string;
} & ShapeCore;

/*export interface ShapeArray extends Omit<ShapeCore, "type"> {
  $array: Shape;
}

export interface ShapeObject extends Omit<ShapeCore, "type"> {
  $object: Shape;
}*/

export interface Shape {
  [attr: string]: ShapeCore | Shape; //| ShapeArray | ShapeObject;
}
