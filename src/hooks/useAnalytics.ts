'use client'

import { useCallback } from 'react'

type EventName =
  | 'PAGE_VIEW'
  | 'FILTER_CHANGE'
  | 'SORT_CHANGE'
  | 'VIEW_TOGGLE'
  | 'PAGINATION_CHANGE'
  | 'EMAIL_SUBMIT'
  | 'ERROR'

interface AnalyticsEvent {
  name: EventName
  properties?: Record<string, unknown>
}

export function useAnalytics() {
  const trackEvent = useCallback((_event: AnalyticsEvent) => {
    // Skip tracking in development environment
    if (process.env.NODE_ENV !== 'production') {
      return
    }

    // In production, send events to analytics service
    // Example implementation (replace with actual analytics service):
    // analyticsService.track(_event.name, _event.properties)
  }, [])

  return { trackEvent }
}
