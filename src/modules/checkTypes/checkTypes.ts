export const isString = (val: unknown): val is string => {
  return typeof val === "string";
};

export const isNumber = (val: unknown): val is number => {
  return typeof val === "number";
};

export const isBoolean = (val: unknown): val is boolean => {
  return typeof val === "boolean";
};

export const isUndefined = (val: unknown): val is undefined => {
  return typeof val === "undefined";
};

export const isArray = (val: unknown): val is Record<number, unknown> => {
  return Array.isArray(val);
};

export const isObject = (val: unknown): val is Record<string, unknown> => {
  return Object.prototype.toString.call(val) === "[object Object]";
};

export const isNull = (val: unknown): val is null => {
  return Object.prototype.toString.call(val) === "[object Null]";
};

export const isKeyValue = (
  val: unknown
): val is Record<string | number | symbol, unknown> => {
  return typeof val === "object" && !isNull(val);
};
