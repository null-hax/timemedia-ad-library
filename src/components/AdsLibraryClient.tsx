'use client'

import { Hero } from '@/components/Hero'
import { AdsGrid } from '@/components/AdsGrid'

export default function AdsLibraryClient() {
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="">
        <AdsGrid 
          showFilters={true}
          showViewToggle={true}
        />
      </div>
    </div>
  )
} 