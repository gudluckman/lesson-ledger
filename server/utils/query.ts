import { ParsedQs } from "qs";

type QueryValue = string | string[] | ParsedQs | ParsedQs[] | undefined;

const getQueryString = (value: QueryValue) =>
  typeof value === "string" ? value : undefined;

const getQueryNumber = (value: QueryValue) => {
  const stringValue = getQueryString(value);
  if (!stringValue) return undefined;

  const numberValue = Number.parseInt(stringValue, 10);
  return Number.isFinite(numberValue) ? numberValue : undefined;
};

export { getQueryNumber, getQueryString };
