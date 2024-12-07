export interface Ad {
  id: string
  companyName: string
  companyId: string
  adCopy: string
  date: string
  newsletterName: string
  company: Company
  image: string
  link: string
  readMoreLink: string
}

export type ViewType = 'table' | 'card'

export interface FilterState {
  dateRange?: {
    from: Date | null;
    to: Date | null;
  };
  tags?: string[];
  search?: string;
  companyId?: string;
  newsletterId?: string;
  newsletterIds?: string[];
}

export const DEFAULT_FILTER_STATE: FilterState = {
  search: '',
  dateRange: {
    from: null,
    to: null
  },
  newsletterNames: [],
  tags: [],
  companyId: null,
  newsletterName: null
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

export interface Newsletter {
  id: string
  name: string
  slug: string
  description: string
  traffic_rank: number
}

export interface Company {
  id: string
  name: string
  slug: string
  tags: string[]
  description?: string
  image?: string
}

export interface AdTrend {
  date: string
  count: number
  by_newsletter?: Record<string, number>
  by_company?: Record<string, number>
  by_tag?: Record<string, number>
}
