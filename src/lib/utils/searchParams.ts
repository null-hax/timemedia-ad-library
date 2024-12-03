import { FilterState, PaginationState, SortState, ViewType } from '@/types/ads'

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

interface ParsedState {
  filters: FilterState
  sort: SortState
  pagination: PaginationState
  view: ViewType
}

export function parseSearchParams(searchParams: URLSearchParams): ParsedState {
  // Parse filters
  const filters: FilterState = {
    ...DEFAULT_FILTER_STATE,
    search: searchParams.get('search') || DEFAULT_FILTER_STATE.search,
    dateRange: {
      from: searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : null,
      to: searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : null,
    },
    newsletterCount: {
      min: searchParams.get('countMin') ? Number(searchParams.get('countMin')) : null,
      max: searchParams.get('countMax') ? Number(searchParams.get('countMax')) : null,
    },
    tags: searchParams.getAll('tags'),
    companyId: searchParams.get('companyId') || null,
    newsletterId: searchParams.get('newsletterId') || null,
  }

  // Parse sort
  const sort: SortState = {
    field: (searchParams.get('sortField') as SortState['field']) || DEFAULT_SORT_STATE.field,
    direction: (searchParams.get('sortDir') as SortState['direction']) || DEFAULT_SORT_STATE.direction,
  }

  // Parse pagination
  const pagination: PaginationState = {
    page: Number(searchParams.get('page')) || DEFAULT_PAGINATION_STATE.page,
    pageSize: Number(searchParams.get('pageSize')) || DEFAULT_PAGINATION_STATE.pageSize,
  }

  // Parse view
  const view = (searchParams.get('view') as ViewType) || DEFAULT_VIEW

  return {
    filters,
    sort,
    pagination,
    view,
  }
}

export function stringifySearchParams(state: ParsedState): string {
  const params = new URLSearchParams()

  // Add filters
  if (state.filters.search) params.set('search', state.filters.search)
  if (state.filters.dateRange.from) params.set('dateFrom', state.filters.dateRange.from.toISOString())
  if (state.filters.dateRange.to) params.set('dateTo', state.filters.dateRange.to.toISOString())
  if (state.filters.newsletterCount.min) params.set('countMin', state.filters.newsletterCount.min.toString())
  if (state.filters.newsletterCount.max) params.set('countMax', state.filters.newsletterCount.max.toString())
  state.filters.tags.forEach(tag => params.append('tags', tag))
  if (state.filters.companyId) params.set('companyId', state.filters.companyId)
  if (state.filters.newsletterId) params.set('newsletterId', state.filters.newsletterId)

  // Add sort
  params.set('sortField', state.sort.field)
  params.set('sortDir', state.sort.direction)

  // Add pagination
  params.set('page', state.pagination.page.toString())
  params.set('pageSize', state.pagination.pageSize.toString())

  // Add view
  params.set('view', state.view)

  return params.toString()
} 