import { NextRequest, NextResponse } from 'next/server'
import { generateMockAds } from '@/lib/mock/generateMockData'
import type { Ad, ApiResponse } from '@/types/ads'

// Generate mock data once when the API route is initialized
const TOTAL_MOCK_ADS = 100
const mockAds = generateMockAds(TOTAL_MOCK_ADS)

export async function GET(request: NextRequest) {
  try {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const sortField =
      (searchParams.get('sortField') as keyof Ad) || 'companyName'
    const sortDirection =
      (searchParams.get('sortDirection') as 'asc' | 'desc') || 'asc'

    // Get all filter parameters
    const search = searchParams.get('search') || ''
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const newslettersMin = searchParams.get('newslettersMin')
      ? parseInt(searchParams.get('newslettersMin')!)
      : null
    const newslettersMax = searchParams.get('newslettersMax')
      ? parseInt(searchParams.get('newslettersMax')!)
      : null

    let filteredAds = [...mockAds]

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredAds = filteredAds.filter(
        (ad) =>
          ad.companyName.toLowerCase().includes(searchLower) ||
          ad.adCopy.toLowerCase().includes(searchLower)
      )
    }

    // Apply date range filter
    if (dateFrom) {
      const fromDate = new Date(dateFrom)
      filteredAds = filteredAds.filter(
        (ad) => new Date(ad.lastSeen) >= fromDate
      )
    }
    if (dateTo) {
      const toDate = new Date(dateTo)
      filteredAds = filteredAds.filter((ad) => new Date(ad.firstSeen) <= toDate)
    }

    // Apply newsletter count filter
    if (newslettersMin !== null) {
      filteredAds = filteredAds.filter(
        (ad) => ad.newsletterCount >= newslettersMin
      )
    }
    if (newslettersMax !== null) {
      filteredAds = filteredAds.filter(
        (ad) => ad.newsletterCount <= newslettersMax
      )
    }

    // Apply sorting
    filteredAds.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      const modifier = sortDirection === 'asc' ? 1 : -1

      if (typeof aValue === 'string') {
        return aValue.localeCompare(bValue as string) * modifier
      }
      return ((aValue as number) - (bValue as number)) * modifier
    })

    // Apply pagination
    const total = filteredAds.length
    const start = (page - 1) * pageSize
    const paginatedAds = filteredAds.slice(start, start + pageSize)

    const response: ApiResponse<Ad[]> = {
      data: paginatedAds,
      total,
      page,
      pageSize,
    }

    return NextResponse.json(response)
  } catch (_error) {
    // Log error in production environments
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service
      // Implementation will be added when error tracking service is integrated
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
