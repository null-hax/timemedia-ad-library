import { getServerAds } from '@/app/_actions/ads'
import { USE_SUPABASE } from '@/lib/config'
import { Ad } from '@/types/ads'

export async function getAds(): Promise<Ad[]> {
  if (USE_SUPABASE) {
    try {
      const ads = await getServerAds()
      if (!ads || ads.length === 0) {
        console.warn('No ads returned from Supabase')
        return []
      }
      return ads
    } catch (error) {
      console.error('Error fetching from Supabase:', error)
      return []
    }
  }
  return []
} 