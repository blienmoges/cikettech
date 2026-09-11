import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getServerApiBase } from "../../../lib/api";

const SESSION_COOKIE = "cikettech_admin_session";
const SESSION_MAX_AGE = 8 * 60 * 60;

export async function POST(request: Request) {
  const body = await request.json();
  const response = await fetch(`${getServerApiBase()}/api/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = await response.json();

  if (!response.ok) return NextResponse.json(data, { status: response.status });

  const result = NextResponse.json(data);
  result.cookies.set(SESSION_COOKIE, data.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return result;
}

export async function DELETE() {
  const result = NextResponse.json({ ok: true });
  result.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return result;
}
