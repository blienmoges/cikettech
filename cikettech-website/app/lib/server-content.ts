import { getServerApiBase } from "./api";
import { getLocale } from "./locale";

/**
 * Server Components only — attaches the visitor's language preference (see
 * app/lib/locale.ts) so the backend can return already-localized content.
 *
 * This lives in its own module (separate from app/lib/api.ts) because it
 * depends on next/headers via getLocale(); api.ts is also imported by client
 * components (forms, adminFetch, etc.), and next/headers cannot be part of
 * any module reachable from a Client Component's bundle.
 */
export async function apiGet<T>(path: string): Promise<T> {
  const locale = await getLocale();
  const separator = path.includes("?") ? "&" : "?";
  const res = await fetch(`${getServerApiBase()}${path}${separator}lang=${locale}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Backend request failed: GET ${path} -> ${res.status}`);
  }
  return res.json() as Promise<T>;
}
