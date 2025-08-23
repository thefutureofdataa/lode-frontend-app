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
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <label>Password:</label>
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <a href="/auth/register" className="forgot-password"> Forgot your password?</a>
          <button className='button1' type="button" onClick={handleSubmit}>Log In</button>
          {error && <div className="error">{error}</div>}
          <button className="button2" type="button">
              <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google Logo" className="google-logo"
              />
              Continue with Google
          </button>
          <a href="/auth/register" className="join-waitlist"> No account? Click here to join the waitlist!</a>
          {/*
           Remember to redirect the waitlist link
          */}
        </div>
      </div>

    </>
  )
}

export default SignInPage