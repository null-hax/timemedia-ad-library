import { newsletters, generateMockAds } from '@/lib/mock/generateMockData'
import { Newsletter, Ad, ApiResponse } from '@/types/ads'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const newsletter = newsletters.find(n => n.id === params.id)
  
  if (!newsletter) {
    return new Response('Newsletter not found', { status: 404 })
  }

  // Get all ads that appeared in this newsletter
  const ads = generateMockAds(100).filter(ad => 
    ad.newsletters.some(n => n.id === params.id)
  )

  const response: ApiResponse<{
    newsletter: Newsletter
    ads: Ad[]
  }> = {
    data: {
      newsletter,
      ads,
    },
    total: ads.length,
    page: 1,
    pageSize: ads.length,
  }

  return Response.json(response)
} 