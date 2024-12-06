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
import { getAds as getSupabaseAds } from '@/lib/services/ads'
import { USE_SUPABASE } from '@/lib/config'
import { startOfDay } from 'date-fns'

interface UseAdsProps {
  filters: FilterState
  sort: SortState
  pagination: PaginationState
  initialAds?: Ad[]
}

// Add date validation helper
const isValidDate = (date: any): date is Date => {
  return date instanceof Date && !isNaN(date.getTime())
}

export function useAds({ filters, sort, pagination, initialAds }: UseAdsProps) {
  const [data, setData] = useState<ApiResponse<Ad[]> | null>(null)
  const [loading, setLoading] = useState(!initialAds)
  const [error, setError] = useState<Error | null>(null)

  const processAds = useCallback(async (rawAds: Ad[]) => {
    let filteredAds = [...rawAds]

    // Apply date range filter first with validation
    if (filters.dateRange.from || filters.dateRange.to) {
      filteredAds = filteredAds.filter(ad => {
        const adDate = startOfDay(new Date(ad.date))
        const from = filters.dateRange.from && isValidDate(filters.dateRange.from) ? startOfDay(filters.dateRange.from) : null
        const to = filters.dateRange.to && isValidDate(filters.dateRange.to) ? startOfDay(filters.dateRange.to) : null

        if (from && adDate < from) return false
        if (to && adDate > to) return false
        return true
      })
    }

    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredAds = filteredAds.filter(ad => 
        ad.company.name.toLowerCase().includes(searchTerm) ||
        ad.adCopy.toLowerCase().includes(searchTerm)
      )
    }

    if (filters.companyId) {
      filteredAds = filteredAds.filter(ad => ad.companyId === filters.companyId)
    }

    // Handle both single newsletter and multiple newsletter selection
    if (filters.newsletterId) {
      filteredAds = filteredAds.filter(ad => 
        ad.newsletters.some(newsletter => newsletter.id === filters.newsletterId)
      )
    } else if (filters.newsletterIds.length > 0) {
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

    // Apply sorting
    filteredAds.sort((a, b) => {
      const aValue = a[sort.field]
      const bValue = b[sort.field]
      const modifier = sort.direction === 'asc' ? 1 : -1

      if (aValue === undefined && bValue === undefined) return 0
      if (aValue === undefined) return 1 * modifier
      if (bValue === undefined) return -1 * modifier

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * modifier
      }
      
      if (aValue < bValue) return -1 * modifier
      if (aValue > bValue) return 1 * modifier
      return 0
    })

    // Apply pagination
    const start = (pagination.page - 1) * pagination.pageSize
    const paginatedAds = filteredAds.slice(start, start + pagination.pageSize)

    return {
      data: paginatedAds,
      total: filteredAds.length,
      page: pagination.page,
      pageSize: pagination.pageSize,
    }
  }, [filters, sort, pagination])

  useEffect(() => {
    const fetchAndProcessAds = async () => {
      try {
        setLoading(true)
        
        // Use initialAds if provided, otherwise fetch new data
        const rawAds = initialAds || (USE_SUPABASE ? await getSupabaseAds() : generateMockAds(100))
        const processed = await processAds(rawAds)
        setData(processed)
        
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch ads'))
      } finally {
        setLoading(false)
      }
    }

    fetchAndProcessAds()
  }, [filters, sort, pagination, initialAds, processAds])

  return { data, loading, error }
}
