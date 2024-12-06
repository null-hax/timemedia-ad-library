import { generateMockAds } from '@/lib/mock/generateMockData'
import { getServerAds } from '@/app/_actions/ads'
import { USE_SUPABASE } from '@/lib/config'
import { Ad } from '@/types/ads'

export async function getAds(): Promise<Ad[]> {
  if (USE_SUPABASE) {
    try {
      const ads = await getServerAds()
      if (ads.length === 0) {
        console.warn('No ads returned from Supabase, falling back to mock data')
        return generateMockAds()
      }
      return ads
    } catch (error) {
      console.error('Error fetching from Supabase:', error)
      console.warn('Falling back to mock data due to Supabase error')
      return generateMockAds()
    }
  }
  return generateMockAds()
} 