'use client'

import { useEffect } from 'react'
import { useAnalytics } from '@/hooks/useAnalytics'

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      trackEvent({
        name: 'ERROR',
        properties: {
          message: error.message,
          digest: error.digest,
          stack: error.stack,
        },
      })
    }
  }, [error, trackEvent])

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-8">
        We apologize for the inconvenience. Please try again.
      </p>
      <button
        onClick={reset}
        className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
