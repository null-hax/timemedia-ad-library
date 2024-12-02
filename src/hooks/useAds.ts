'use client'

import { useState, useEffect } from 'react'
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
          ...(filters.newsletterCount.min !== null && {
            newslettersMin: filters.newsletterCount.min.toString(),
          }),
          ...(filters.newsletterCount.max !== null && {
            newslettersMax: filters.newsletterCount.max.toString(),
          }),
        })

        const response = await fetch(`/api/library?${params}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const json = await response.json()

        if ('error' in json) {
          throw new Error(json.error)
        }

        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch data'))
      } finally {
        setLoading(false)
      }
    }

    fetchAds()
  }, [filters, sort, pagination])

  return { data, loading, error }
}
