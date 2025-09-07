import { NextResponse } from "next/server"
import { createClient } from "@/app/utils/supabase/server.js"

export async function GET(request) {
	const { searchParams, origin } = new URL(request.url)
	const code = searchParams.get("code")
	let next = searchParams.get("next") ?? "/"
	if (!next.startsWith("/")) {
		next = "/"
	}

	const supabase = await createClient()

	// Exchange the ?code (PKCE) for a session and set HttpOnly cookies
	const { error } = await supabase.auth.exchangeCodeForSession(code)
	if (error) {
		console.log("error", error)
		return new NextResponse(`<p>Auth failed: ${error.message}</p>`, {
			headers: { "Content-Type": "text/html" },
			status: 400,
		})
	}

	const {data: { user } } = await supabase.auth.getUser()
	if (!user) {
		return NextResponse.redirect(`${origin}/error?reason=auth_code_error`)
	}
	const { data: allowedUser } = await supabase
		.from("user_waitlist")
		.select("allowed")
		.eq("email", user.email)
		.single()

	if (!allowedUser || allowedUser.allowed !== true) {
		await supabase.auth.signOut()
		return NextResponse.redirect(`${origin}/error?reason=unauthorized`)
	}

	// Return minimal HTML that runs IN THE POPUP
	const html = `
		<!doctype html><meta charset="utf-8">
		<script>
			try {
			if (window.opener && !window.opener.closed) {
				// Send message to parent window
				window.opener.postMessage({ type: 'supabase-auth' }, location.origin);
			}
			} finally {
			window.close();
			}
		</script>
	`
	return new NextResponse(html, { headers: { "Content-Type": "text/html" } })
}
