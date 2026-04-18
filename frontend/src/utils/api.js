// src/utils/api.js
// ─────────────────────────────────────────────────────────
// Single source of truth for your backend URL.
// Development : http://localhost:5000
// Production  : whatever VITE_API_URL is set to in Vercel
// ─────────────────────────────────────────────────────────

export const BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL + "";

/**
 * Authenticated fetch — automatically adds Bearer token
 *
 * Usage:
 *   import { apiFetch, BASE_URL } from "../utils/api";
 *   const res  = await apiFetch("/api/tasks");
 *   const data = await res.json();
 */
export const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    // Only set Content-Type for JSON — not for FormData (file uploads)
    ...(options.body && !(options.body instanceof FormData)
      ? { "Content-Type": "application/json" }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Auto-logout if token expired
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  return res;
};
