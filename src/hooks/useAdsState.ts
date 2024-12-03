'use client'

import { useState, useCallback } from 'react'
import { useAnalytics } from './useAnalytics'
import type { FilterState, SortState, PaginationState, ViewType } from '@/types/ads'

export const DEFAULT_FILTER_STATE: FilterState = {
  search: '',
  dateRange: {
    from: null,
    to: null,
  },
  newsletterCount: {
    min: null,
    max: null,
  },
  tags: [],
}

const DEFAULT_SORT_STATE: SortState = {
  field: 'date',
  direction: 'desc',
}

const DEFAULT_PAGINATION_STATE: PaginationState = {
  page: 1,
  pageSize: 20,
}

export function useAdsState() {
  const { trackEvent } = useAnalytics()

  const [view, setView] = useState<ViewType>('card')
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE)
  const [sort, setSort] = useState<SortState>(DEFAULT_SORT_STATE)
  const [pagination, setPagination] = useState<PaginationState>(DEFAULT_PAGINATION_STATE)

  const setViewMemoized = useCallback((newView: ViewType) => {
    setView(newView)
    trackEvent({
      name: 'VIEW_TOGGLE',
      properties: { view: newView },
    })
  }, [trackEvent])

  const setFiltersMemoized = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => {
      const updated = {
        ...prev,
        ...newFilters,
      }
      trackEvent({
        name: 'FILTER_CHANGE',
        properties: { filters: newFilters },
      })
      return updated
    })
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [trackEvent])

  const setSortMemoized = useCallback((newSort: SortState) => {
    setSort(newSort)
    trackEvent({
      name: 'SORT_CHANGE',
      properties: { sort: newSort },
    })
  }, [trackEvent])

  const setPaginationMemoized = useCallback((newPagination: Partial<PaginationState>) => {
    setPagination(prev => {
      const updated = { ...prev, ...newPagination }
      trackEvent({
        name: 'PAGINATION_CHANGE',
        properties: { pagination: newPagination },
      })
      return updated
    })
  }, [trackEvent])

  return {
    filters,
    setFilters: setFiltersMemoized,
    sort,
    setSort: setSortMemoized,
    pagination,
    setPagination: setPaginationMemoized,
    view,
    setView: setViewMemoized,
  }
}
