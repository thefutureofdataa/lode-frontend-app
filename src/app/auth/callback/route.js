import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const returnTo = url.searchParams.get("returnTo") || "/";

  // we’ll set cookies on this redirect response
  const res = NextResponse.redirect(new URL(returnTo, req.url));

  if (!code) return res;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (n) => res.cookies.get(n)?.value,
        set: (n, v, o) => res.cookies.set({ name: n, value: v, ...o }),
        remove: (n, o) => res.cookies.set({ name: n, value: "", ...o }),
      },
    }
  );

  // Exchanges PKCE code and sets Secure, HttpOnly cookies on `res`
  await supabase.auth.exchangeCodeForSession(code);
  return res;
}
