"use server"

import { createClient } from "../utils/supabase/server"

export async function signup(email) {
  try {
    // Validate email
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address' }
    }

    const supabase = await createClient()

    // Insert email into user_whitelist table
    const { data, error } = await supabase
      .from('user_waitlist')
      .insert([
        { 
          email: email.toLowerCase().trim(),
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      // Handle duplicate email error
      if (error.code === '23505') {
        return { success: false, error: 'This email is already on the waitlist' }
      }
      
      // Handle RLS policy violation
      if (error.code === '42501') {
        console.error('RLS Policy violation:', error)
        return { success: false, error: 'Unable to join waitlist due to security restrictions. Please contact support.' }
      }
      
      console.error('Supabase error:', error)
      return { success: false, error: 'Failed to join waitlist. Please try again.' }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Signup error:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}
