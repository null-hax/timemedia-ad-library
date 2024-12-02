'use client'

import { useState, useEffect } from 'react'
import type { Ad, FilterState, SortState, PaginationState, ApiResponse } from '@/types/ads'

interface UseAdsProps {
  filters: FilterState
  sort: SortState
  pagination: PaginationState
}

export function useAds({ filters, sort, pagination }: UseAdsProps) {
  const [data, setData] = useState<ApiResponse<Ad[]> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          page: pagination.page.toString(),
          pageSize: pagination.pageSize.toString(),
          sortField: sort.field,
          sortDirection: sort.direction,
          ...(filters.search && { search: filters.search }),
          ...(filters.dateRange.from && { dateFrom: filters.dateRange.from }),
          ...(filters.dateRange.to && { dateTo: filters.dateRange.to }),
          ...(filters.mentionsRange.min !== null && { 
            mentionsMin: filters.mentionsRange.min.toString() 
          }),
          ...(filters.mentionsRange.max !== null && { 
            mentionsMax: filters.mentionsRange.max.toString() 
          }),
          ...(filters.newsletterCount.min !== null && { 
            newslettersMin: filters.newsletterCount.min.toString() 
          }),
          ...(filters.newsletterCount.max !== null && { 
            newslettersMax: filters.newsletterCount.max.toString() 
          })
        })

        const response = await fetch(`/api/ads?${params}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const json = await response.json()
        
        if ('error' in json) {
          throw new Error(json.error)
        }
        
        setData(json)
      } catch (err) {
        console.error('Fetch error:', err)
        setError(err instanceof Error ? err : new Error('An error occurred'))
      } finally {
        setLoading(false)
      }
    }

    fetchAds()
  }, [filters, sort, pagination])

  return { data, loading, error }
} 