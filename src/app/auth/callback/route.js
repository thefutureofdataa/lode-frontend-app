import { NextResponse } from "next/server"
import { createClient } from "@/app/utils/supabase/server.js"

export async function GET(request) {
	const { searchParams, origin } = new URL(request.url)
	const code = searchParams.get("code")
	let next = searchParams.get("next") ?? "/"
	if (!next.startsWith("/")) {
		next = "/"
	}

	if (code) {
		const supabase = await createClient()
		const { error } = await supabase.auth.exchangeCodeForSession(code)
		if (!error) {
			const { data: { user } } = await supabase.auth.getUser()
			if (!user) {
				return NextResponse.redirect(`${origin}/error?reason=auth_code_error`)
			}
            const { data: allowedUser } = await supabase
                .from('allowed_users')
                .select('id')
                .eq('email', user.email)
                .single()

            if (!allowedUser) {
                await supabase.auth.signOut()
                return NextResponse.redirect(`${origin}/error?reason=unauthorized`)
            }
            const forwardedHost = request.headers.get("x-forwarded-host") // original origin before load balancer
			const isLocalEnv = process.env.NODE_ENV === "development"
			if (isLocalEnv) {
				// we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
				return NextResponse.redirect(`${origin}${next}`)
			} else if (forwardedHost) {
				return NextResponse.redirect(`https://${forwardedHost}${next}`)
			} else {
				return NextResponse.redirect(`${origin}${next}`)
			}
		}
	}

	// return the user to an error page with instructions
	return NextResponse.redirect(`${origin}/error?reason=auth_code_error`)
}
