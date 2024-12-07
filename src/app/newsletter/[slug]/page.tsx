'use client'

import { newsletters, generateMockAds } from '@/lib/mock/generateMockData'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { notFound } from 'next/navigation'
import { useParams, useRouter } from 'next/navigation'
import { AdsGrid } from '@/components/AdsGrid'
import { NewsletterInsights } from '@/components/Charts/NewsletterInsights'
import { Separator } from '@/components/ui/separator'
import { formatNumber } from '@/lib/utils'
import { 
  Users, 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Mail,
  Tag
} from 'lucide-react'
import { useState } from 'react'
import { subDays, startOfDay } from 'date-fns'

function getDateRangeText(from: Date, to: Date): string {
  const diffInDays = Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1
  return `${diffInDays} days`
}

export default function NewsletterPage() {
  const params = useParams()
  const slug = params.slug as string
  const router = useRouter()
  const [dateRange, setDateRange] = useState<{from: Date | null; to: Date | null}>({
    from: subDays(new Date(), 30),
    to: new Date()
  })

  const newsletter = newsletters.find((n) => n.slug === slug)

  if (!newsletter) {
    notFound()
  }

  const handleTagClick = (tag: string) => {
    router.push(`/?tags=${tag}`)
  }

  // Get ads for this newsletter with date range filter
  const newsletterAds = generateMockAds(100)
    .filter(ad => {
      // Filter by newsletter
      if (!ad.newsletters.some(n => n.id === newsletter.id)) return false
      
      // Filter by date range
      if (dateRange.from && dateRange.to) {
        const adDate = startOfDay(new Date(ad.date))
        return adDate >= startOfDay(dateRange.from) && adDate <= startOfDay(dateRange.to)
      }
      return true
    })

  // Calculate quick stats
  const uniqueAdvertisers = new Set(newsletterAds.map(ad => ad.companyId)).size
  const totalAds = newsletterAds.length
  const avgAdsPerIssue = 2.3 // This would come from real data
  const frequency = "Daily" // This would come from newsletter data

  const quickStats = [
    {
      label: 'Traffic Rank',
      value: `#${formatNumber(newsletter.traffic_rank)}`,
      icon: TrendingUp,
      description: 'Global rank by subscriber count'
    },
    {
      label: 'Unique Advertisers',
      value: uniqueAdvertisers,
      icon: Users,
      description: 'Companies that have advertised'
    },
    {
      label: 'Total Ads',
      value: totalAds,
      icon: BarChart3,
      description: 'Ads tracked in our database'
    },
    {
      label: 'Frequency',
      value: frequency,
      icon: Calendar,
      description: 'Publication schedule'
    },
    {
      label: 'Avg. Ads per Issue',
      value: avgAdsPerIssue,
      icon: Mail,
      description: 'Ads per newsletter release'
    }
  ]

  const handleDateRangeChange = (from: Date | null, to: Date | null) => {
    setDateRange({ from, to })
  }

  // Update the stats footer text based on date range
  const statsTimeText = dateRange.from && dateRange.to
    ? getDateRangeText(dateRange.from, dateRange.to)
    : "90 days" // default fallback

  return (
    <div className="container mx-auto py-8 space-y-6 pb-0">
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex gap-6">
            <div className="space-y-3">
              <div>
                <h1 className="text-3xl font-bold">{newsletter.name}</h1>
                <p className="text-muted-foreground mt-2">
                  {newsletter.description}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-2">
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
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickStats.map((stat, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            * Statistics based on data from the last {statsTimeText}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1">
          <NewsletterInsights 
            newsletter={newsletter}
            ads={newsletterAds}
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
          />
          
          <Separator className="mt-8" />
          
          <div>
            <AdsGrid 
              initialFilters={{ 
                newsletterId: newsletter.id.toString(),
                dateRange: dateRange
              }}
              showFilters={false}
              showViewToggle={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
