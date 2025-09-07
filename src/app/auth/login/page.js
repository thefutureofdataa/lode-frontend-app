"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ToastContainer, toast } from "react-toastify"
import "./page.css"
import NavBar from "../../../components/NavBar"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { createClient } from "@/app/utils/supabase/client.js"
import { login } from "./actions"
import { useRouter } from "next/navigation"

const SignInPage = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const supabase = createClient()

	const loginWithGooglePopup = async () => {
		if (loading) return
		setLoading(true)
		setError("")

		try {
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

			if (!popup) {
				throw new Error("Popup blocked! Please allow popups for this site.")
			}

			// Listen for messages from the popup
			const messageListener = async (evt) => {
				if (evt.origin !== window.location.origin) return

				if (evt.data?.type === "supabase-auth") {
					// Successfully signed in
					toast.success("Successfully signed in with Google!")

					// Get the current session
					const {
						data: { session },
					} = await supabase.auth.getSession()
					console.log("session", session)
					if (session) {
						// Redirect to home page
						router.push("/")
					}

					console.log("session", session)
					// Clean up
					window.removeEventListener("message", messageListener)
					popup.close()
				}
			}

			window.addEventListener("message", messageListener)

			// Check if popup was closed manually
			const checkClosed = setInterval(() => {
				if (popup.closed) {
					clearInterval(checkClosed)
					window.removeEventListener("message", messageListener)
					setLoading(false)
				}
			}, 1000)

			// Timeout after 5 minutes
			setTimeout(() => {
				if (!popup.closed) {
					popup.close()
					clearInterval(checkClosed)
					window.removeEventListener("message", messageListener)
					setLoading(false)
					toast.error("Sign-in timed out. Please try again.")
				}
			}, 300000) // 5 minutes
		} catch (error) {
			console.error("Google sign-in error:", error)
			setError(error.message || "Failed to sign in with Google")
			toast.error(error.message || "Failed to sign in with Google")
		} finally {
			setLoading(false)
		}
	}

	const GoogleButton = () => {
		return (
			<button type="button" className="button2" onClick={loginWithGooglePopup} disabled={loading}>
				<Image src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" className="google-logo" width={20} height={20} />
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
						<a href="/waitlist" className="join-waitlist">
							No account? Click here to join the waitlist!
						</a>
					</form>
				</div>
			</div>
			<ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={true} closeOnClick />
		</>
	)
}

export default SignInPage
