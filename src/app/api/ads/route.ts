import { NextRequest, NextResponse } from 'next/server'
import { generateMockAds } from '@/lib/mock/generateMockData'
import { Ad, FilterState, SortState, ApiResponse } from '@/types/ads'

const TOTAL_MOCK_ADS = 100
const mockAds = generateMockAds(TOTAL_MOCK_ADS)

function filterAds(
  ads: Ad[],
  filters: Partial<FilterState>,
  sort: Partial<SortState>,
  page: number,
  pageSize: number
): ApiResponse<Ad[]> {
  let filteredAds = [...ads]

  // Apply filters
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filteredAds = filteredAds.filter(ad => 
      ad.companyName.toLowerCase().includes(searchLower) ||
      ad.adCopy.toLowerCase().includes(searchLower)
    )
  }

  if (filters.dateRange?.from) {
    filteredAds = filteredAds.filter(ad => 
      new Date(ad.firstSeen) >= new Date(filters.dateRange.from!)
    )
  }

  if (filters.dateRange?.to) {
    filteredAds = filteredAds.filter(ad => 
      new Date(ad.lastSeen) <= new Date(filters.dateRange.to!)
    )
  }

  // Apply sorting
  if (sort.field && sort.direction) {
    filteredAds.sort((a, b) => {
      const aValue = a[sort.field!]
      const bValue = b[sort.field!]
      const modifier = sort.direction === 'asc' ? 1 : -1

      if (typeof aValue === 'string') {
        return aValue.localeCompare(bValue as string) * modifier
      }
      return ((aValue as number) - (bValue as number)) * modifier
    })
  }

  // Apply pagination
  const start = (page - 1) * pageSize
  const paginatedAds = filteredAds.slice(start, start + pageSize)

  return {
    data: paginatedAds,
    total: filteredAds.length,
    page,
    pageSize
  }
}

export async function GET(request: NextRequest) {
  try {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 500))

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const search = searchParams.get('search') || ''
    const sortField = searchParams.get('sortField') as keyof Ad || 'companyName'
    const sortDirection = searchParams.get('sortDirection') as 'asc' | 'desc' || 'asc'

    // Simulate random errors (1% chance)
    if (Math.random() < 0.01) {
      throw new Error('Random server error')
    }

    const response = filterAds(
      mockAds,
      { search },
      { field: sortField, direction: sortDirection },
      page,
      pageSize
    )

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 