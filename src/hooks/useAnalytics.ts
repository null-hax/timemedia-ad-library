'use client'

import { useCallback } from 'react'
type EventName =
  | 'PAGE_VIEW'
  | 'FILTER_CHANGE'
  | 'SORT_CHANGE'
  | 'VIEW_TOGGLE'
  | 'PAGINATION_CHANGE'
  | 'EMAIL_SUBMIT'

interface AnalyticsEvent {
  name: EventName
  properties?: Record<string, unknown>
}

export function useAnalytics() {
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    // In development, just log to console
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event)
      return
    }

    // TODO: Implement real analytics tracking
  }, [])

  return { trackEvent }
}
