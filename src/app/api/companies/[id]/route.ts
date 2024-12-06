import { NextRequest, NextResponse } from 'next/server'
import { companies, generateMockAds } from '@/lib/mock/generateMockData'
import { Company, Ad, ApiResponse } from '@/types/ads'
import { corsResponse, corsOptionsResponse } from '@/lib/cors'

export async function OPTIONS() {
  return corsOptionsResponse()
}

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const company = companies.find((c) => c.id === params.id)

    if (!company) {
      return corsResponse(
        NextResponse.json({ error: 'Company not found' }, { status: 404 })
      )
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

    return corsResponse(NextResponse.json(response))
  } catch (error) {
    return corsResponse(
      NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    )
  }
}
