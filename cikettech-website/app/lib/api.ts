export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

/** Server Components/Route Handlers only. In Docker Compose (or any setup
 * where the frontend and backend run in separate containers), "localhost"
 * inside the frontend container doesn't reach the backend container — set
 * INTERNAL_API_BASE (e.g. "http://backend:4000") so server-side fetches use
 * the internal service hostname while the browser keeps using NEXT_PUBLIC_API_BASE.
 * Reading a non-NEXT_PUBLIC_ env var always resolves to undefined in client
 * bundles, so this safely falls back to API_BASE there. */
export function getServerApiBase(): string {
  return process.env.INTERNAL_API_BASE || API_BASE;
}

const TOKEN_KEY = "cikettech_admin_token";

/** Uploaded files are stored as backend-relative paths (e.g. "/uploads/x.jpg");
 * external URLs (Unsplash, Wikimedia, ...) are left untouched. */
export function resolveMediaUrl(src?: string): string {
  if (!src) return "";
  return src.startsWith("/") ? `${API_BASE}${src}` : src;
}

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string) {
  if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
}

/** Reads {email, role} out of the stored JWT for UI purposes only (e.g. hiding
 * a Delete button for non-Administrators) — this is not a security boundary,
 * the backend enforces every permission independently regardless of what the
 * UI shows. JWTs are base64, not encrypted, so this needs no secret. */
export function getCurrentUser(): { email: string; role: string } | null {
  const token = getAdminToken();
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const decoded = JSON.parse(json);
    return { email: decoded.email, role: decoded.role };
  } catch {
    return null;
  }
}

/**
 * Fetch wrapper for admin mutations (POST/PUT/PATCH/DELETE) — attaches the stored
 * bearer token automatically, and bounces to the login page if the session is
 * missing or has expired.
 */
export async function adminFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getAdminToken();
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 401 && typeof window !== "undefined") {
    clearAdminToken();
    window.location.href = "/admin/login";
  }
  return res;
}
