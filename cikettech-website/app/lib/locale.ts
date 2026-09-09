import { cookies } from "next/headers";

export type Locale = "en" | "am";

const COOKIE_NAME = "lang";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === "am" ? "am" : "en";
}
