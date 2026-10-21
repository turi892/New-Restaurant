const configuredApiBaseUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";

export const API_BASE_URL = configuredApiBaseUrl.replace(/\/+$/, "");

export const apiUrl = (path) =>
  `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
