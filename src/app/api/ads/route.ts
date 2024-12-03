import { generateMockAds } from '@/lib/mock/generateMockData'
import { Ad, ApiResponse } from '@/types/ads'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  let ads = generateMockAds(100) // Generate a larger pool of ads

  // Apply filters
  if (searchParams.get('search')) {
    const search = searchParams.get('search')!.toLowerCase()
    ads = ads.filter(
      (ad) =>
        ad.companyName.toLowerCase().includes(search) ||
        ad.adCopy.toLowerCase().includes(search) ||
        ad.newsletters.some((n) => n.name.toLowerCase().includes(search))
    )
  }

  // Date filter
  const dateFrom = searchParams.get('dateRange.from')
  const dateTo = searchParams.get('dateRange.to')

  if (dateFrom) {
    ads = ads.filter((ad) => new Date(ad.date) >= new Date(dateFrom))
  }
  if (dateTo) {
    ads = ads.filter((ad) => new Date(ad.date) <= new Date(dateTo))
  }

  // Newsletter count filter
  const minNewsletters = searchParams.get('newsletterCount.min')
  const maxNewsletters = searchParams.get('newsletterCount.max')

  if (minNewsletters) {
    ads = ads.filter((ad) => ad.newsletters.length >= parseInt(minNewsletters))
  }
  if (maxNewsletters) {
    ads = ads.filter((ad) => ad.newsletters.length <= parseInt(maxNewsletters))
  }

  // Tag filter
  const tags = searchParams.getAll('tags')
  if (tags.length > 0) {
    ads = ads.filter((ad) =>
      // Check if any of the ad's company tags match any of the filter tags
      tags.some((filterTag) => ad.company.tags.includes(filterTag))
    )
  }

  // Update the newsletter filter
  const newsletters = searchParams.getAll('newsletters')
  if (newsletters.length > 0) {
    ads = ads.filter((ad) =>
      // Ad must appear in ANY of the selected newsletters
      newsletters.some((newsletterId) =>
        ad.newsletters.some((n) => n.id === newsletterId)
      )
    )
  }

  // Sorting
  const sortField = searchParams.get('sort.field') || 'date'
  const sortDirection = searchParams.get('sort.direction') || 'desc'

  ads.sort((a: any, b: any) => {
    const aVal = a[sortField]
    const bVal = b[sortField]

    if (sortField === 'newsletters') {
      return sortDirection === 'asc'
        ? a.newsletters.length - b.newsletters.length
        : b.newsletters.length - a.newsletters.length
    }

    return sortDirection === 'asc'
      ? aVal > bVal
        ? 1
        : -1
      : aVal < bVal
        ? 1
        : -1
  })

  // Pagination
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '20')
  const start = (page - 1) * pageSize
  const paginatedAds = ads.slice(start, start + pageSize)

  const response: ApiResponse<Ad[]> = {
    data: paginatedAds,
    total: ads.length,
    page,
    pageSize,
  }

  return Response.json(response)
}
