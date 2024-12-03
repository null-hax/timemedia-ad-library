'use client'

import { useUrlState } from './useUrlState'
import { useAnalytics } from './useAnalytics'
import type { FilterState, SortState, PaginationState } from '@/types/ads'

const DEFAULT_FILTER_STATE: FilterState = {
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

  const [filters, setFilters] = useUrlState('filters', DEFAULT_FILTER_STATE)
  const [sort, setSort] = useUrlState('sort', DEFAULT_SORT_STATE)
  const [pagination, setPagination] = useUrlState(
    'pagination',
    DEFAULT_PAGINATION_STATE
  )
  const [view, setView] = useUrlState('view', 'table' as 'table' | 'card')

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page
    trackEvent({
      name: 'FILTER_CHANGE',
      properties: { filters: newFilters },
    })
  }

  const handleSortChange = (newSort: SortState) => {
    setSort(newSort)
    trackEvent({
      name: 'SORT_CHANGE',
      properties: { sort: newSort },
    })
  }

  const handlePaginationChange = (newPagination: Partial<PaginationState>) => {
    setPagination(prev => ({ ...prev, ...newPagination }))
    trackEvent({
      name: 'PAGINATION_CHANGE',
      properties: { pagination: newPagination },
    })
  }

  const handleViewChange = (newView: 'table' | 'card') => {
    setView(newView)
    trackEvent({
      name: 'VIEW_TOGGLE',
      properties: { view: newView },
    })
  }

  return {
    filters,
    setFilters: handleFilterChange,
    sort,
    setSort: handleSortChange,
    pagination,
    setPagination: handlePaginationChange,
    view,
    setView: handleViewChange,
  }
}
