import { getServerApiBase } from "./api";
import { getLocale } from "./locale";
import { cookies } from "next/headers";
import { toTranslationOverrides, type TranslationOverrides } from "./i18n";

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
  const session = (await cookies()).get("cikettech_admin_session")?.value;
  const separator = path.includes("?") ? "&" : "?";
  const res = await fetch(`${getServerApiBase()}${path}${separator}lang=${locale}`, {
    headers: session ? { Authorization: `Bearer ${session}` } : undefined,
    ...(path.startsWith("/api/admin") ? { cache: "no-store" as const } : { next: { revalidate: 60 } }),
  });
  if (!res.ok) {
    throw new Error(`Backend request failed: GET ${path} -> ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function getTranslations(): Promise<TranslationOverrides> {
  const rows = await apiGet<{ key: string; en: string; am: string }[]>("/api/translations").catch(() => []);
  return toTranslationOverrides(rows);
}
