'use client'

import { useCallback, useState } from 'react'
import { FilterState, PaginationState, SortState, ViewType } from '@/types/ads'

export const DEFAULT_FILTER_STATE: FilterState = {
  search: '',
  dateRange: {
    from: null,
    to: null,
  },
  newsletterIds: [],
  tags: [],
  companyId: null,
  newsletterId: null
}

const DEFAULT_SORT_STATE: SortState = {
  field: 'date',
  direction: 'desc',
}

const DEFAULT_PAGINATION_STATE: PaginationState = {
  page: 1,
  pageSize: 12,
}

const DEFAULT_VIEW: ViewType = 'card'

const isValidDateRange = (from: Date | null, to: Date | null): boolean => {
  if (!from || !to) return false
  return from <= to
}

export function useAdsState(initialFilters: Partial<FilterState> = {}) {
  const validatedInitialFilters = {
    ...initialFilters,
    dateRange: initialFilters.dateRange && isValidDateRange(initialFilters.dateRange.from, initialFilters.dateRange.to)
      ? initialFilters.dateRange
      : DEFAULT_FILTER_STATE.dateRange
  }

  const [filters, setFiltersState] = useState<FilterState>({
    ...DEFAULT_FILTER_STATE,
    ...validatedInitialFilters
  })
  const [sort, setSortState] = useState<SortState>(DEFAULT_SORT_STATE)
  const [pagination, setPaginationState] = useState<PaginationState>(DEFAULT_PAGINATION_STATE)
  const [view, setViewState] = useState<ViewType>(DEFAULT_VIEW)

  const setFilters = useCallback((newFilters: Partial<FilterState> | ((prev: FilterState) => FilterState)) => {
    if (typeof newFilters === 'function') {
      setFiltersState(newFilters)
    } else {
      setFiltersState(prev => ({
        ...prev,
        ...newFilters
      }))
    }
    setPaginationState(prev => ({ ...prev, page: 1 }))
  }, [])

  const setSort = useCallback((newSort: SortState) => {
    setSortState(newSort)
    setPaginationState(prev => ({ ...prev, page: 1 }))
  }, [])

  const setPagination = useCallback((newPagination: Partial<PaginationState>) => {
    setPaginationState(prev => ({ ...prev, ...newPagination }))
  }, [])

  const setView = useCallback((newView: ViewType) => {
    setViewState(newView)
  }, [])

  return {
    filters,
    setFilters,
    sort,
    setSort,
    pagination,
    setPagination,
    view,
    setView,
  }
}
