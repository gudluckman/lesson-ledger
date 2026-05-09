export const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5005/api/v1"
    : "https://lesson-ledger-api.vercel.app/api/v1");
