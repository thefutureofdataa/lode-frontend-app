"use client"

import { useState } from "react"
import { signup } from "./actions"
import "./page.css"

const page = () => {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const result = await signup(email)
            
            if (result.success) {
                setEmail("")
				window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSeB5DJiw-CX2g0zL_hLjGqxY4eMFug-J65X3Xvzx6PE8qBStQ/viewform"
            } else {
                setError(result.error)
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
		<>
			{loading && (
				<div className="loading-container">
					<div className="spinner"></div>
				</div>
			)}
			<div className="waitlist-container">
				<div className="waitlist-box">
					<h1>Join the waitlist to get early access</h1>
					<form onSubmit={handleSubmit}>
						<input 
							type="email" 
							placeholder="Email" 
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							disabled={loading}
						/>
						<button type="submit" className="button" disabled={loading}>
							{loading ? "Joining..." : "Join"}
						</button>
					</form>
					{error && <div className="error-message">{error}</div>}
				</div>
			</div>
		</>
	)
}

export default page
