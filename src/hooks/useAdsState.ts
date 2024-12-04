'use client'

import { useCallback, useState } from 'react'
import { FilterState, PaginationState, SortState, ViewType } from '@/types/ads'

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
  companyId: null,
  newsletterId: null,
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

export function useAdsState(initialFilters: Partial<FilterState> = {}) {
  // Merge initial filters with defaults
  const mergedFilters = {
    ...DEFAULT_FILTER_STATE,
    ...initialFilters
  }

  const [filters, setFiltersState] = useState<FilterState>(mergedFilters)
  const [sort, setSortState] = useState<SortState>(DEFAULT_SORT_STATE)
  const [pagination, setPaginationState] = useState<PaginationState>(DEFAULT_PAGINATION_STATE)
  const [view, setViewState] = useState<ViewType>(DEFAULT_VIEW)

  // Wrapped state setters
  const setFilters = useCallback((newFilters: FilterState) => {
    setFiltersState(newFilters)
    setPaginationState(prev => ({ ...prev, page: 1 })) // Reset to first page
  }, [])

  const setSort = useCallback((newSort: SortState) => {
    setSortState(newSort)
    setPaginationState(prev => ({ ...prev, page: 1 })) // Reset to first page
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
