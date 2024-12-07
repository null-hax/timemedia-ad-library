'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tag, Users, BarChart3, Calendar } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { AdsGrid } from '@/components/AdsGrid/index'
import { subDays } from 'date-fns'
import { useRouter } from 'next/navigation'
import { Newsletter } from '@/lib/services/newsletters'
import { Ad } from '@/types/ads'
import { formatNumber } from '@/lib/utils'
import { NewsletterInsights } from '@/components/Charts/NewsletterInsights'
import { useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

type NewsletterViewProps = {
  newsletter: Newsletter & { isDemo?: boolean }
  mentions: Ad[]
}

export function NewsletterView({ newsletter, mentions }: NewsletterViewProps) {
  const router = useRouter()
  const [dateRange, setDateRange] = useState<{from: Date | null; to: Date | null}>({
    from: subDays(new Date(), 30),
    to: new Date()
  })

  const handleTagClick = (tag: string) => {
    router.push(`/?tags=${tag}`)
  }

  const handleDateRangeChange = (from: Date | null, to: Date | null) => {
    setDateRange({ from, to })
  }

  // Calculate quick stats from mentions data
  const calculateStats = (ads: Ad[], dateRange: {from: Date | null; to: Date | null}) => {
    const filteredAds = ads.filter(ad => {
      const adDate = new Date(ad.date)
      return (!dateRange.from || adDate >= dateRange.from) && 
             (!dateRange.to || adDate <= dateRange.to)
    })

    const uniqueAdvertisers = new Set(filteredAds.map(ad => ad.companyId)).size
    const totalAds = filteredAds.length
    const daysDiff = dateRange.from && dateRange.to ? 
      Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) : 
      30
    const avgAdsPerDay = totalAds / daysDiff

    return { uniqueAdvertisers, totalAds, avgAdsPerDay }
  }

  const stats = calculateStats(mentions, dateRange)

  const quickStats = [
    {
      label: 'Unique Advertisers',
      value: stats.uniqueAdvertisers,
      icon: Users,
      description: 'Companies that have advertised'
    },
    {
      label: 'Total Ads',
      value: formatNumber(stats.totalAds),
      icon: BarChart3,
      description: 'Ads tracked in our database'
    },
    {
      label: 'Avg. Ads per Day',
      value: stats.avgAdsPerDay.toFixed(1),
      icon: Calendar,
      description: 'Based on selected date range'
    }
  ]

  return (
    <div className="container mx-auto py-8 space-y-6 pb-0">
      {newsletter.isDemo && (
        <Alert className="mb-6 border-2 border-yellow-500/50 bg-yellow-50/50">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <AlertDescription className="text-sm text-yellow-800 py-1">
              This is a demo page showing how newsletter insights would appear. 
              Real data for this newsletter is coming soon to our database!
            </AlertDescription>
          </div>
        </Alert>
      )}

      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex gap-6">
            <div className="space-y-3">
              <div>
                <h1 className="text-3xl font-bold">{newsletter.from_name}</h1>
                <p className="text-muted-foreground mt-2">
                  {newsletter.description}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-2">
                  {newsletter.tags?.map((tag) => (
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            * Statistics based on data from the last 30 days
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1">
          <NewsletterInsights 
            newsletter={newsletter}
            ads={mentions}
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            className={newsletter.isDemo ? "grayscale opacity-75" : ""}
          />
          
          <Separator className="mt-8" />
          
          <div>
            <AdsGrid 
              initialFilters={{ 
                newsletterName: newsletter.from_name,
                dateRange
              }}
              initialAds={mentions}
              showFilters={false}
              showViewToggle={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 