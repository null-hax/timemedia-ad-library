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
  const mergedFilters = {
    ...DEFAULT_FILTER_STATE,
    ...initialFilters
  }

  const [filters, setFiltersState] = useState<FilterState>(mergedFilters)
  const [sort, setSortState] = useState<SortState>(DEFAULT_SORT_STATE)
  const [pagination, setPaginationState] = useState<PaginationState>(DEFAULT_PAGINATION_STATE)
  const [view, setViewState] = useState<ViewType>(DEFAULT_VIEW)

  const setFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFiltersState(prev => ({
      ...prev,
      ...newFilters
    }))
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
