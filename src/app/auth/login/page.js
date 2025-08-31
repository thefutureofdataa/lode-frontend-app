"use client"

import { useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import "./page.css"
import NavBar from "../../../components/NavBar"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { createClient } from "@/app/utils/supabase/client.js"
import { login } from "./actions"

const SignInPage = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)

	const supabase = createClient()

	const loginWithGooglePopup = async () => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${location.origin}/auth/callback`,
        skipBrowserRedirect: true,
				scopes: "openid email profile",
				queryParams: { prompt: "consent", access_type: "offline" },
			},
		})
		if (error) {
			throw error
		}

    const popup = window.open(data.url, "supabase-auth", "width=500,height=600")

		window.addEventListener("message", async (evt) => {
      console.log("evt", evt)
			if (evt.origin !== window.location.origin) return
			if (evt.data?.type === "supabase-auth") {
				// You now have a valid session in memory & localStorage.
				// Optionally re-fetch profile or refresh UI.
				console.log("Signed in:", evt.data.session)
			}
		})
	}

	const GoogleButton = () => {
		return (
			<button
				type="button" // prevent form submission
				className="button2"
				onClick={loginWithGooglePopup}
			>
				<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" className="google-logo" />
				Continue with Google
			</button>
		)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (loading) return // Prevent spamming
		setLoading(true)
		setError("")

		const result = await login(email, password)
		console.log(result)
		setLoading(false)
	}

	return (
		<>
			<NavBar />
			{loading && (
				<div className="loading-container">
					<div className="spinner"></div>
				</div>
			)}
			<div className="auth-container">
				<div className="auth-box">
					<h1>Welcome to Lode</h1>
					<form onSubmit={handleSubmit}>
						<label>Email:</label>
						<input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} disabled={loading} />
						<label>Password:</label>
						<div className="password-container">
							<input
								type={showPassword ? "text" : "password"}
								placeholder="Password"
								onChange={(e) => setPassword(e.target.value)}
								disabled={loading}
							/>
							{showPassword ? (
								<FaEye className="eye-icon" onClick={() => setShowPassword(!showPassword)} />
							) : (
								<FaEyeSlash className="eye-icon" onClick={() => setShowPassword(!showPassword)} />
							)}
						</div>
						<a href="/auth/register" className="forgot-password">
							{" "}
							Forgot your password?
						</a>
						<button className="button1" type="submit" disabled={loading}>
							{loading ? "Logging In..." : "Log In"}
						</button>
						{error && <div className="error">{error}</div>}
						<GoogleButton />
						<a href="/auth/register" className="join-waitlist">
							{" "}
							No account? Click here to join the waitlist!
						</a>
						{/*
             Remember to redirect the waitlist link
            */}
					</form>
				</div>
			</div>
			<ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={true} closeOnClick />
		</>
	)
}

export default SignInPage
