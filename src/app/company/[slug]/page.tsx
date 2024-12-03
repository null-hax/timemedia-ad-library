'use client'

import { companies, generateMockAds } from '@/lib/mock/generateMockData'
import { AdCard } from '@/components/CardView/Card'
import { AdTrendChart } from '@/components/Charts/AdTrendChart'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

export default function CompanyPage() {
  const params = useParams()
  const slug = params.slug as string
  const router = useRouter()

  const company = companies.find((c) => c.slug === slug)

  if (!company) {
    notFound()
  }

  const ads = generateMockAds(100).filter((ad) => ad.companyId === company.id)

  const handleTagClick = (tag: string) => {
    router.push(`/?tags=${tag}`)
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <header className="space-y-4">
        <div className="flex items-center gap-4">
          {company.image && (
            <img
              src={company.image}
              alt={company.name}
              className="w-16 h-16 rounded-lg"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{company.name}</h1>
            <p className="text-muted-foreground">{company.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {company.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
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
