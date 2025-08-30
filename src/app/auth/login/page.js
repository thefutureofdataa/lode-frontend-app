'use client'

import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import './page.css'
import NavBar from '../../../components/NavBar'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { supabase } from "./client.js";

const SignInPage = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `http://localhost:3000`,   // must be allow-listed
        scopes: 'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        queryParams: { access_type: 'offline', prompt: 'consent' } // get refreshable Google tokens if you need them
      }
    })
  }


  const GoogleButton = () => {
    return (
      <button
        className="button2"
        onClick={handleGoogleSignIn}>
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google Logo" className="google-logo"
        />
        Continue with Google
      </button>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return; // Prevent spamming
    setLoading(true)
    setError('')

    // Simulate an API call
    setTimeout(() => {
      setLoading(false)
      if (email === 'test@test.com' && password === 'password') {
        alert('Sign in successful!')
        toast.success('Sign in successful!')
      } else {
        setError('Invalid email or password')
        toast.error('Invalid email or password')
      }
    }, 2000)
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
              <input type={showPassword ? 'text' : 'password'} placeholder="Password" onChange={(e) => setPassword(e.target.value)} disabled={loading} />
              {
                showPassword ? <FaEye className="eye-icon" onClick={() => setShowPassword(!showPassword)} /> : <FaEyeSlash className="eye-icon" onClick={() => setShowPassword(!showPassword)} />
              }
            </div>
            <a href="/auth/register" className="forgot-password"> Forgot your password?</a>
            <button className='button1' type="submit" disabled={loading}>
              {loading ? 'Logging In...' : 'Log In'}
            </button>
            {error && <div className="error">{error}</div>}
            <GoogleButton />
            <a href="/auth/register" className="join-waitlist"> No account? Click here to join the waitlist!</a>
            {/*
             Remember to redirect the waitlist link
            */}
          </form>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={true}
        closeOnClick
      />
    </>
  )
}

export default SignInPage