import { companies, generateMockAds } from '@/lib/mock/generateMockData'
import { Company, Ad, ApiResponse } from '@/types/ads'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const company = companies.find((c) => c.id === params.id)

  if (!company) {
    return new Response('Company not found', { status: 404 })
  }

  // Get all ads for this company
  const ads = generateMockAds(100).filter((ad) => ad.companyId === params.id)

  const response: ApiResponse<{
    company: Company
    ads: Ad[]
  }> = {
    data: {
      company,
      ads,
    },
    total: ads.length,
    page: 1,
    pageSize: ads.length,
  }

  return Response.json(response)
}
