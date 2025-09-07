"use client"

import { useState } from "react"
import NavBar from "../../components/NavBar"
import { signup } from "./actions"
import "./page.css"

const page = () => {
	
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        setLoading(true)

        try {
            const result = await signup(email)
            
            if (result.success) {
                setSuccess("Successfully joined the waitlist!")
                setEmail("") // Clear the form
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
			<NavBar />
			<div className="waitlist-container">
				<div className="waitlist-box">
					<h1>Waitlist</h1>
					<p>Join the waitlist to get early access to the app.</p>
					<form onSubmit={handleSubmit}>
						<label>Email:</label>
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
					{success && <div className="success-message">{success}</div>}
				</div>
			</div>
		</>
	)
}

export default page
