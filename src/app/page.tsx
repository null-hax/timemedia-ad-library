import { Hero } from '@/components/Hero'
import { AdsGrid } from '@/components/AdsGrid'
import { getAds } from '@/lib/services/ads'

export default async function Page() {
  // Pre-fetch the ads data
  const initialAds = await getAds()
  
  return (
    <div>
      <Hero />
      <AdsGrid 
        showFilters={true}
        showViewToggle={false}
        initialAds={initialAds}
      />
    </div>
  )
}
