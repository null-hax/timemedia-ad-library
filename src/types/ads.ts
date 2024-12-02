export interface Ad {
  id: string
  companyName: string
  adCopy: string
  mentions: number
  firstSeen: string
  lastSeen: string
  newsletterCount: number
}

export interface FilterState {
  search: string
  dateRange: {
    from: string | null
    to: string | null
  }
  mentionsRange: {
    min: number | null
    max: number | null
  }
  newsletterCount: {
    min: number | null
    max: number | null
  }
}

export interface SortState {
  field: keyof Ad
  direction: 'asc' | 'desc'
}

export interface PaginationState {
  page: number
  pageSize: number
}

export interface ApiResponse<T> {
  data: T
  total: number
  page: number
  pageSize: number
}
