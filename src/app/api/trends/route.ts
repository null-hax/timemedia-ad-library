import { generateMockAds } from '@/lib/mock/generateMockData'
import { AdTrend } from '@/types/ads'
import { startOfDay, eachDayOfInterval, subDays } from 'date-fns'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get('days') || '30')
  const companyId = searchParams.get('companyId')
  const newsletterId = searchParams.get('newsletterId')
  const tag = searchParams.get('tag')

  const endDate = startOfDay(new Date())
  const startDate = subDays(endDate, days)
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate })

  const ads = generateMockAds(1000) // Larger pool for meaningful trends
    .filter((ad) => {
      if (companyId && ad.companyId !== companyId) return false
      if (newsletterId && !ad.newsletters.some((n) => n.id === newsletterId))
        return false
      if (tag && !ad.company.tags.includes(tag)) return false
      return true
    })

  const trends: AdTrend[] = dateRange.map((date) => {
    const dayAds = ads.filter(
      (ad) => startOfDay(new Date(ad.date)).getTime() === date.getTime()
    )

    return {
      date: date.toISOString(),
      count: dayAds.length,
      ...(newsletterId && {
        by_newsletter: dayAds.reduce(
          (acc, ad) => {
            ad.newsletters.forEach((n) => {
              acc[n.name] = (acc[n.name] || 0) + 1
            })
            return acc
          },
          {} as Record<string, number>
        ),
      }),
      ...(companyId && {
        by_company: dayAds.reduce(
          (acc, ad) => {
            acc[ad.companyName] = (acc[ad.companyName] || 0) + 1
            return acc
          },
          {} as Record<string, number>
        ),
      }),
      ...(tag && {
        by_tag: dayAds.reduce(
          (acc, ad) => {
            ad.company.tags.forEach((t) => {
              acc[t] = (acc[t] || 0) + 1
            })
            return acc
          },
          {} as Record<string, number>
        ),
      }),
    }
  })

  return Response.json(trends)
}
