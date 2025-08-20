// Shared API helper to configure the base URL for back‑end requests.
// If REACT_APP_API_BASE_URL is defined (e.g. in your environment), that value
// is used as the API base; otherwise it defaults to localhost on port 4000.

const API_BASE =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';

/**
 * Generic fetch wrapper that prefixes paths with the API base.
 *
 * Usage:
 *   apiFetch('/api/schedules', { headers: { Authorization: `Bearer ${token}` } })
 *
 * This will request `${API_BASE}/api/schedules`.
 *
 * @param {string} path The path to request, beginning with a leading slash.
 * @param {RequestInit} [options] Additional options passed to fetch().
 * @returns {Promise<Response>} The fetch response promise.
 */
export function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  return fetch(url, options);
}

export { API_BASE };