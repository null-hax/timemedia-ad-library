'use client'

import { useState } from 'react'
import { Ad, Newsletter } from '@/types/ads'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format } from 'date-fns'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import { getLineColors, chartColors } from '@/lib/utils/chartStyles'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

type ViewType = 'sponsors' | 'activity' | 'categories'

interface NewsletterInsightsProps {
  newsletter: Newsletter
  ads: Ad[]
}

export function NewsletterInsights({ newsletter, ads }: NewsletterInsightsProps) {
  const [view, setView] = useState<ViewType>('sponsors')

  // Process data for sponsors chart
  const sponsorsData = ads.reduce((acc, ad) => {
    const company = ad.company.name
    acc[company] = (acc[company] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const sponsorsChartData: ChartData<'bar'> = {
    labels: Object.entries(sponsorsData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name]) => name),
    datasets: [
      {
        label: 'Appearances',
        data: Object.entries(sponsorsData)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([, count]) => count),
        backgroundColor: chartColors.primary,
        borderRadius: 6,
        barThickness: 16,
      },
    ],
  }

  // Process data for activity timeline
  const timelineDataMap = ads.reduce((acc, ad) => {
    const date = format(new Date(ad.date), 'MMM d')
    const company = ad.company.name
    
    if (!acc[date]) acc[date] = {}
    acc[date][company] = (acc[date][company] || 0) + 1
    
    return acc
  }, {} as Record<string, Record<string, number>>)

  const dates = Object.keys(timelineDataMap).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  )

  const top5Companies = Object.entries(sponsorsData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name]) => name)

  const timelineChartData: ChartData<'line'> = {
    labels: dates,
    datasets: top5Companies.map((company, index) => {
      const colors = getLineColors(index)
      return {
        label: company,
        data: dates.map(date => timelineDataMap[date][company] || 0),
        borderColor: colors.line,
        backgroundColor: colors.background,
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      }
    }),
  }

  // Process data for category breakdown
  const categoryData = ads.reduce((acc, ad) => {
    ad.company.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  const sortedCategories = Object.entries(categoryData)
    .sort(([, a], [, b]) => b - a)

  const categoryChartData: ChartData<'bar'> = {
    labels: sortedCategories.map(([name]) => name),
    datasets: [
      {
        label: 'Ads',
        data: sortedCategories.map(([, count]) => count),
        backgroundColor: chartColors.primary,
        borderRadius: 6,
        barThickness: 16,
      },
    ],
  }

  const barOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: chartColors.secondary,
        bodyColor: chartColors.secondary,
        borderColor: chartColors.border,
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        displayColors: false,
        callbacks: {
          label: (context) => `${context.parsed.x} appearances`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: chartColors.muted,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: chartColors.muted,
          font: {
            weight: 'bold',
          },
        },
      },
    },
  }

  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            weight: 'bold',
          },
          color: chartColors.secondary,
        },
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: chartColors.secondary,
        bodyColor: chartColors.secondary,
        borderColor: chartColors.border,
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 14,
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: chartColors.muted,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: chartColors.grid,
        },
        ticks: {
          color: chartColors.muted,
          stepSize: 1,
        },
      },
    },
  }

  const viewOptions = {
    sponsors: {
      title: 'Top Advertisers',
      description: `Most frequent advertisers in ${newsletter.name}, ranked by number of appearances`,
    },
    activity: {
      title: 'Advertising Activity',
      description: 'Daily advertising activity from top 5 sponsors over time',
    },
    categories: {
      title: 'Industry Breakdown',
      description: 'Distribution of ads by advertiser industry',
    },
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-semibold">{viewOptions[view].title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {viewOptions[view].description}
          </p>
        </div>
        <Select
          value={view}
          onValueChange={(value) => setView(value as ViewType)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sponsors">Top Advertisers</SelectItem>
            <SelectItem value="activity">Activity Timeline</SelectItem>
            <SelectItem value="categories">Industry Breakdown</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[300px]">
        {view === 'sponsors' && (
          <Bar data={sponsorsChartData} options={barOptions} />
        )}

        {view === 'activity' && (
          <Line data={timelineChartData} options={lineOptions} />
        )}

        {view === 'categories' && (
          <Bar data={categoryChartData} options={barOptions} />
        )}
      </div>
    </Card>
  )
} 