export type ErrorOut = string[];

export type Error = { [k: string]: ErrorOut | Error };

export type FieldType = "string" | "number" | "boolean" | "object";

export interface ShapeCore {
  optional?: boolean;
  type?: FieldType;
  extraCheck?: (s: string) => string[] | undefined;
  errorLabel?: string;
  defaultValue?: string;
}

export type ShapeLinear = {
  name: string;
} & ShapeCore;

export interface ShapeArray {
  $array: Shape;
}

export interface Shape {
  [attr: string]: ShapeCore | Shape | ShapeArray;
}
