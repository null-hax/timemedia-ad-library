'use client'

import { newsletters } from '@/lib/mock/generateMockData'
import { AdTrendChart } from '@/components/Charts/AdTrendChart'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { notFound } from 'next/navigation'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { AdsGrid } from '@/components/AdsGrid'
import { NewsletterInsights } from '@/components/Charts/NewsletterAdFrequency'
import { generateMockAds } from '@/lib/mock/generateMockData'

export default function NewsletterPage() {
  const params = useParams()
  const slug = params.slug as string
  const router = useRouter()

  const newsletter = newsletters.find((n) => n.slug === slug)

  if (!newsletter) {
    notFound()
  }

  const handleTagClick = (tag: string) => {
    router.push(`/?tags=${tag}`)
  }

  // Get ads for this newsletter
  const newsletterAds = generateMockAds(100).filter(ad => 
    ad.newsletters.some(n => n.id === newsletter.id)
  )

  return (
    <div className="container mx-auto py-8 space-y-8">
      <header className="space-y-4">
        <div className="flex items-center gap-4">
          {newsletter.image && (
            <Image
              src={newsletter.image}
              alt={newsletter.name}
              width={64}
              height={64}
              className="rounded-lg"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{newsletter.name}</h1>
            <p className="text-muted-foreground max-w-3xl">{newsletter.description}</p>
          </div>
        </div>
      </header>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <NewsletterInsights 
            newsletter={newsletter}
            ads={newsletterAds}
          />
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Newsletter Stats</h2>
          <div className="prose max-w-none">
            <ul className="space-y-2">
              <li>
                <span className="font-semibold">Traffic Rank:</span>{' '}
                {newsletter.traffic_rank.toLocaleString()}
              </li>
              <li>
                <span className="font-semibold">Avg. Ads per Issue:</span> 2.3
              </li>
              <li>
                <span className="font-semibold">Top Categories:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Technology', 'SaaS', 'Finance'].map((tag) => (
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
              </li>
            </ul>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-6">Advertiser Analysis</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Overview</h3>
              <p className="text-muted-foreground">
                {newsletter.name} primarily features advertisers in the technology and 
                SaaS space, with a focus on B2B products and services.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Top Advertisers</h3>
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Company A</h4>
                  <p className="text-sm text-muted-foreground">
                    Consistent advertiser with 12 appearances in the last 3 months.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Company B</h4>
                  <p className="text-sm text-muted-foreground">
                    Recent campaign with 8 appearances in the last month.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-3">
          <h2 className="text-2xl font-semibold mb-6">Recent Ads</h2>
          <AdsGrid 
            initialFilters={{ newsletterId: newsletter.id }}
            showFilters={false}
            showViewToggle={true}
          />
        </div>
      </div>
    </div>
  )
}
