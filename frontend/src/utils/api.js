// src/utils/api.js
// Single source of truth for your backend URL.
// In development: uses localhost:5000
// In production (Vercel): uses VITE_API_URL environment variable

export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Authenticated fetch wrapper
 * Usage: const data = await apiFetch("/api/tasks")
 */
export const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  return res;
};
