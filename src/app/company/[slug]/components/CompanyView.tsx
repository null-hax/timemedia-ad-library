'use client'

import { AdTrendChart } from '@/components/Charts/AdTrendChart'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tag } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { AdsGrid } from '@/components/AdsGrid'
import { subDays } from 'date-fns'
import { useRouter } from 'next/navigation'
import { CompanyData, RelatedCompany } from '@/lib/services/companies'
import { Ad } from '@/types/ads'

type CompanyViewProps = {
  company: CompanyData
  relatedCompanies: RelatedCompany[]
  mentions: Ad[]
}

export function CompanyView({ company, relatedCompanies, mentions }: CompanyViewProps) {
  const router = useRouter()

  const handleTagClick = (tag: string) => {
    router.push(`/?tags=${tag}`)
  }

  const appearedIn = company.appeared_in || {} as Record<string, number>

  return (
    <div className="container mx-auto py-8 space-y-8 pb-0">
      <header className="space-y-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{company.company_name}</h1>
            <p className="text-muted-foreground mt-2">{company.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-wrap gap-2">
            {company.tags?.map((tag: string) => (
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
                {company.market_overview}
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Key Competitors</h3>
              <div className="space-y-6">
                {relatedCompanies.map((related) => (
                  <div key={related.id} className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">{related.company_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {related.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Ad Frequency</h2>
          <div className="h-48">
            <AdTrendChart 
              data={mentions}
              dateRange={{
                from: subDays(new Date(), 30),
                to: new Date()
              }}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Audience Profile</h2>
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: company.audience_profile }} />
            <p className="mt-4">Most frequently seen in:</p>
            <ul>
              {Object.entries(appearedIn)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([newsletter, count]) => (
                  <li key={newsletter}>{newsletter} ({count} mentions)</li>
                ))}
            </ul>
          </div>
        </Card>

        <div className="lg:col-span-3">
          <Separator />
          <AdsGrid 
            initialFilters={{ 
              companyId: company.id
            }}
            initialAds={mentions}
            showFilters={false}
            showViewToggle={true}
          />
        </div>
      </div>
    </div>
  )
} 