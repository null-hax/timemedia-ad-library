'use client'

import { useState, useEffect, useCallback } from 'react'
import type {
  Ad,
  FilterState,
  SortState,
  PaginationState,
  ApiResponse,
} from '@/types/ads'

interface UseAdsProps {
  filters: FilterState
  sort: SortState
  pagination: PaginationState
}

export function useAds({ filters, sort, pagination }: UseAdsProps) {
  const [data, setData] = useState<ApiResponse<Ad[]> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchAds = useCallback(async (isMounted: boolean) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      // Add search params
      if (filters.search) {
        params.append('search', filters.search)
      }

      // Add date range params
      if (filters.dateRange.from) {
        params.append('dateRange.from', filters.dateRange.from)
      }
      if (filters.dateRange.to) {
        params.append('dateRange.to', filters.dateRange.to)
      }

      // Add newsletter count params
      if (filters.newsletterCount.min !== null) {
        params.append('newsletterCount.min', filters.newsletterCount.min.toString())
      }
      if (filters.newsletterCount.max !== null) {
        params.append('newsletterCount.max', filters.newsletterCount.max.toString())
      }

      // Add tag params
      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach(tag => {
          params.append('tags', tag)
        })
      }

      // Add sort params
      params.append('sort.field', sort.field)
      params.append('sort.direction', sort.direction)

      // Add pagination params
      params.append('page', pagination.page.toString())
      params.append('pageSize', pagination.pageSize.toString())

      const response = await fetch(`/api/ads?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch ads')
      
      const json = await response.json()
      if (isMounted) {
        setData(json)
        setLoading(false)
      }
    } catch (err) {
      if (isMounted) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
        setLoading(false)
      }
    }
  }, [filters, sort, pagination])

  useEffect(() => {
    let isMounted = true
    fetchAds(isMounted)
    return () => {
      isMounted = false
    }
  }, [fetchAds])

  return { data, loading, error }
}
