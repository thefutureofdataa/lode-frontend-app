"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/app/utils/supabase/client.js"
import { useRouter } from "next/navigation"
import NavBar from "../../components/NavBar"
import "./page.css"

const DashboardPage = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (userError) {
          console.error('Error getting user:', userError)
          return
        }
        
        if (sessionError) {
          console.error('Error getting session:', sessionError)
          return
        }

        setUser(user)
        setSession(session)
      } catch (error) {
        console.error('Error in getUser:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session)
      setSession(session)
      setUser(session?.user ?? null)
      
      if (event === 'SIGNED_OUT') {
        router.push('/auth/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth, router])

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
      } else {
        router.push('/auth/login')
      }
    } catch (error) {
      console.error('Error in handleLogout:', error)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <>
      <NavBar />
      <div className="dashboard-container">
        <div className="dashboard-content">
          <h1>Protected Dashboard</h1>
          <p>🎉 Congratulations! You've successfully accessed a protected page.</p>
          
          <div className="user-info">
            <h2>User Information</h2>
            {user ? (
              <div className="user-details">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}</p>
                <p><strong>Last Sign In:</strong> {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}</p>
                <p><strong>Email Confirmed:</strong> {user.email_confirmed_at ? 'Yes' : 'No'}</p>
                {user.user_metadata && (
                  <div>
                    <p><strong>Provider:</strong> {user.app_metadata?.provider || 'email'}</p>
                    {user.user_metadata.full_name && (
                      <p><strong>Full Name:</strong> {user.user_metadata.full_name}</p>
                    )}
                    {user.user_metadata.avatar_url && (
                      <p><strong>Avatar:</strong> <img src={user.user_metadata.avatar_url} alt="Avatar" style={{width: '50px', height: '50px', borderRadius: '50%'}} /></p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p>No user data available</p>
            )}
          </div>

          <div className="session-info">
            <h2>Session Information</h2>
            {session ? (
              <div className="session-details">
                <p><strong>Access Token:</strong> {session.access_token ? 'Present' : 'Missing'}</p>
                <p><strong>Refresh Token:</strong> {session.refresh_token ? 'Present' : 'Missing'}</p>
                <p><strong>Expires At:</strong> {new Date(session.expires_at * 1000).toLocaleString()}</p>
                <p><strong>Token Type:</strong> {session.token_type}</p>
              </div>
            ) : (
              <p>No session data available</p>
            )}
          </div>

          <div className="middleware-test">
            <h2>Middleware Test</h2>
            <p>This page is protected by middleware. If you can see this content, the middleware is working correctly!</p>
            <p>The middleware should:</p>
            <ul>
              <li>✅ Check for authenticated user</li>
              <li>✅ Redirect unauthenticated users to /login</li>
              <li>✅ Allow authenticated users to access this page</li>
              <li>✅ Handle session management</li>
            </ul>
          </div>

          <div className="actions">
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
            <a href="/" className="home-link">
              Go to Home
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardPage
