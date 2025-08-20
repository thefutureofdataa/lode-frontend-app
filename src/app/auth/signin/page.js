'use client'

import { useState } from 'react'
import './page.css'
import NavBar from '../../../components/NavBar'

const SignInPage = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simulate an API call
    setTimeout(() => {
      setLoading(false)
      if (email === 'test@test.com' && password === 'password') {
        alert('Sign in successful!')
      } else {
        setError('Invalid email or password')
      }
    }, 1000)
  }

  return (
    <>
      <NavBar />
      {
        loading && <div>Loading...</div>
      }
      <div className="auth-container">
        <div className="auth-box">
          <h1>Welcome to Lode</h1>
          <label>Email:</label>
          <input type="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
          <label>Password:</label>
          <input type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" onClick={handleSubmit}>Sign In</button>
          {error && <div className="error">{error}</div>}
          <p>Don't have an account? <a href="/auth/register">Sign up</a></p>
        </div>
      </div>

    </>
  )
}

export default SignInPage