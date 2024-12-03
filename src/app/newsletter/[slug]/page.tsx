'use client'

import { newsletters, generateMockAds } from '@/lib/mock/generateMockData'
import { AdCard } from '@/components/CardView/Card'
import { AdTrendChart } from '@/components/Charts/AdTrendChart'
import { notFound } from 'next/navigation'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

export default function NewsletterPage() {
  const params = useParams()
  const slug = params.slug as string
  const router = useRouter()

  const newsletter = newsletters.find((n) => n.slug === slug)

  if (!newsletter) {
    notFound()
  }

  const ads = generateMockAds(100).filter((ad) =>
    ad.newsletters.some((n) => n.id === newsletter.id)
  )

  const handleTagClick = (tag: string) => {
    router.push(`/?tags=${tag}`)
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <header className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">{newsletter.name}</h1>
          <p className="text-muted-foreground">{newsletter.description}</p>
        </div>
        <div className="inline-block px-3 py-1 bg-secondary rounded-full text-sm">
          Traffic Rank #{newsletter.traffic_rank}
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Ad Frequency</h2>
        <AdTrendChart data={ads} />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Recent Ads</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} onTagClick={handleTagClick} />
          ))}
        </div>
      </section>
    </div>
  )
}
