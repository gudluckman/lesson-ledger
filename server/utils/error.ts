const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Internal Server Error";

export { getErrorMessage };
