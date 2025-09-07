'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ErrorPage() {
  return (
    <Suspense fallback={null}>
      <ErrorContent />
    </Suspense>
  )
}

function ErrorContent() {
  const searchParams = useSearchParams()
  const reason = searchParams.get('reason')

  const getErrorMessage = (reason) => {
    switch (reason) {
      case 'unauthorized':
        return {
          title: 'Access Denied',
          message: 'Your account is not authorized to access this application. Please contact your administrator.',
          icon: '🚫'
        }
      case 'auth_code_error':
        return {
          title: 'Authentication Error',
          message: 'There was a problem with the authentication process. Please try logging in again.',
          icon: '⚠️'
        }
      default:
        return {
          title: 'Something Went Wrong',
          message: 'An unexpected error occurred. Please try again or contact support.',
          icon: '❌'
        }
    }
  }

  const error = getErrorMessage(reason)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">{error.icon}</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {error.title}
          </h1>
          <p className="text-gray-600 mb-6">
            {error.message}
          </p>
          
          <div className="space-y-3">
            <Link 
              href="/auth/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </Link>
            
            <Link 
              href="/"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}