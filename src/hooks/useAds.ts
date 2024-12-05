'use client'

import { useState, useEffect, useCallback } from 'react'
import type {
  Ad,
  FilterState,
  SortState,
  PaginationState,
  ApiResponse,
} from '@/types/ads'
import { generateMockAds } from '@/lib/mock/generateMockData'

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
    setLoading(true)
    try {
      // Generate mock data
      let filteredAds = generateMockAds(100)

      // Apply filters
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredAds = filteredAds.filter(ad => 
          ad.adCopy.toLowerCase().includes(searchLower) ||
          ad.companyName.toLowerCase().includes(searchLower)
        )
      }

      // Filter by newsletters - check if ad appears in any of the selected newsletters
      if (filters.newsletterIds.length > 0) {
        filteredAds = filteredAds.filter(ad => 
          ad.newsletters.some(newsletter => 
            filters.newsletterIds.includes(newsletter.id)
          )
        )
      }

      if (filters.tags.length > 0) {
        filteredAds = filteredAds.filter(ad => 
          filters.tags.some(tag => ad.company.tags.includes(tag))
        )
      }

      if (filters.dateRange.from || filters.dateRange.to) {
        filteredAds = filteredAds.filter(ad => {
          const adDate = new Date(ad.date)
          if (filters.dateRange.from && adDate < filters.dateRange.from) return false
          if (filters.dateRange.to && adDate > filters.dateRange.to) return false
          return true
        })
      }

      // Apply sorting
      filteredAds.sort((a, b) => {
        const aValue = a[sort.field]
        const bValue = b[sort.field]
        const modifier = sort.direction === 'asc' ? 1 : -1

        // Handle undefined values
        if (aValue === undefined && bValue === undefined) return 0
        if (aValue === undefined) return 1 * modifier
        if (bValue === undefined) return -1 * modifier

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue) * modifier
        }
        
        // Safe to compare now that we've handled undefined cases
        if (aValue < bValue) return -1 * modifier
        if (aValue > bValue) return 1 * modifier
        return 0
      })

      // Apply pagination
      const start = (pagination.page - 1) * pagination.pageSize
      const paginatedAds = filteredAds.slice(start, start + pagination.pageSize)

      setData({
        data: paginatedAds,
        total: filteredAds.length,
        page: pagination.page,
        pageSize: pagination.pageSize,
      })
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch ads'))
    } finally {
      setLoading(false)
    }
  }, [filters, sort, pagination])

  return { data, loading, error }
}
