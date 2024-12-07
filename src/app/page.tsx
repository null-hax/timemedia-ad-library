import { Hero } from '@/components/Hero'
import { AdsGrid } from '@/components/AdsGrid'
import { getAds } from '@/lib/services/ads'
import { Suspense } from 'react'

export default async function Page() {
  try {
    const initialAds = await getAds()
    
    return (
      <div>
        <Hero />
        <Suspense fallback={<div>Loading ads...</div>}>
          <AdsGrid 
            showFilters={true}
            showViewToggle={false}
            initialAds={initialAds}
          />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error('Error in Page component:', error)
    return (
      <div>
        <Hero />
        <AdsGrid 
          showFilters={true}
          showViewToggle={false}
          initialAds={[]}
        />
      </div>
    )
  }
}
