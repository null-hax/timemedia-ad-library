import { Hero } from '@/components/Hero'
import { AdsGrid } from '@/components/AdsGrid'

export default function Page() {
  return (
    <div   >
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
