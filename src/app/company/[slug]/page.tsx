'use client'

import { companies, generateMockAds } from '@/lib/mock/generateMockData'
import { AdTrendChart } from '@/components/Charts/AdTrendChart'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { notFound } from 'next/navigation'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { AdsGrid } from '@/components/AdsGrid'
import { Tag } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function CompanyPage() {
  const params = useParams()
  const slug = params.slug as string
  const router = useRouter()

  const company = companies.find((c) => c.slug === slug)

  if (!company) {
    notFound()
  }

  const handleTagClick = (tag: string) => {
    router.push(`/?tags=${tag}`)
  }

  return (
    <div className="container mx-auto py-8 space-y-8 pb-0">
      <header className="space-y-4">
        <div className="flex items-center gap-4">
          {company.image && (
            <Image
              src={company.image}
              alt={company.name}
              width={64}
              height={64}
              className="rounded-lg"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{company.name}</h1>
            <p className="text-muted-foreground mt-2">{company.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Tag className="h-4 w-4 text-muted-foreground" />
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
        </div>
      </header>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
      <Card className="p-6 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-6">Competitive Analysis</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Market Overview</h3>
              <p className="text-muted-foreground">
                Based on our analysis of {company.name}'s advertising patterns, we've observed 
                consistent presence in high-impact newsletters targeting technology-savvy professionals.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Key Competitors</h3>
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Athletic Greens</h4>
                  <p className="text-sm text-muted-foreground">
                    Primarily targeting health and wellness focused newsletters with an estimated 
                    ad-budget of $65,000 over the past 2 weeks. Spotted in at least 7 newsletters 
                    including Arnold's Pump Club.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Casper Mattresses</h4>
                  <p className="text-sm text-muted-foreground">
                    Targeting similar high-income, tech-savvy audience through wellness and lifestyle 
                    newsletters. Consistent presence in health and fitness focused publications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Ad Frequency</h2>
          <div className="h-48">
            <AdTrendChart data={generateMockAds(100)} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Audience Profile</h2>
          <div className="prose max-w-none">
            <p>
              {company.name} has been primarily sponsoring newsletters with audiences that fit a 
              <strong> high-income earner profile, are young, and are interested in technology</strong>.
            </p>
            <p className="mt-4">
              Most frequently seen in:
            </p>
            <ul>
              <li>Morning Brew</li>
              <li>The Hustle</li>
              <li>TLDR Newsletter</li>
            </ul>
          </div>
        </Card>

        <div className="lg:col-span-3">
        <Separator />

          <AdsGrid 
            initialFilters={{ companyId: company.id }}
            showFilters={false}
            showViewToggle={true}
          />
        </div>
      </div>
    </div>
  )
}
