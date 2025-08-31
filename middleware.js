import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED = [/^\/app(\/|$)/, /^\/settings(\/|$)/];

export async function middleware(req) {
  const url = new URL(req.url);
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (n) => req.cookies.get(n)?.value,
        set: (n, v, o) => res.cookies.set({ name: n, value: v, ...o }),
        remove: (n, o) => res.cookies.set({ name: n, value: "", ...o }),
      },
    }
  );

  // Auto-refreshes if access expired and refresh is valid
  const { data: { user } } = await supabase.auth.getUser();

  const isProtected = PROTECTED.some((r) => r.test(url.pathname));
  if (isProtected && !user) {
    const login = new URL("/login", req.url);
    login.searchParams.set("returnTo", url.pathname + url.search);
    return NextResponse.redirect(login, { status: 307 });
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
