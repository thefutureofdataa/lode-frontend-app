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

  const loginWithGooglePopup = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback?returnTo=/app`, // allow-list this
        skipBrowserRedirect: true,                      // <- key for popup
        scopes: 'openid email profile',
        queryParams: { prompt: 'consent', access_type: 'offline' }
      }
    })
    if (error) throw error;

    const popup = window.open(
      data?.url,                                   // Supabase’s Google auth URL
      'sb-google',
      'width=500,height=600,noopener'
    );

    // Detect sign-in via broadcast/onAuthStateChange and then close the popup
    const { data: sub } = supabase.auth.onAuthStateChange((evt) => {
      if (evt === 'SIGNED_IN') popup?.close();
    });
    // remember to unsubscribe on unmount if you’re in React
  }

  const GoogleButton = () => {
    return (
      <button
        className="button2"
        onClick={loginWithGooglePopup}>
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