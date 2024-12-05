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
import { format, startOfWeek, startOfDay } from 'date-fns'
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
import { ChartDateRangePicker } from '@/components/ui/date-range-picker'

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
  onDateRangeChange?: (from: Date | null, to: Date | null) => void
  dateRange?: {
    from: Date | null
    to: Date | null
  }
}

// Add type for weekly data at the top of the file
type WeeklyDataMap = Record<string, Record<string, number>>

export function NewsletterInsights({ 
  newsletter, 
  ads,
  onDateRangeChange,
  dateRange = { from: null, to: null }
}: NewsletterInsightsProps) {
  const [view, setView] = useState<ViewType>('activity')

  // Filter ads based on date range
  const filteredAds = ads.filter(ad => {
    if (!dateRange.from || !dateRange.to) return true
    const adDate = startOfDay(new Date(ad.date))
    return adDate >= startOfDay(dateRange.from) && adDate <= startOfDay(dateRange.to)
  })

  // Process data for sponsors chart using filteredAds
  const sponsorsData = filteredAds.reduce((acc, ad) => {
    const company = ad.company.name
    acc[company] = (acc[company] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Add this helper function to get a more visually balanced color scheme
  function getEnhancedBarColors(index: number): string {
    // Using a more balanced set of orange shades that maintain good contrast
    const colors = [
      '#ff6b00', // Primary orange
      '#ff6b00', // Pair 1
      '#ff7b1a', 
      '#ff7b1a', // Pair 2
      '#ff8c33',
      '#ff8c33', // Pair 3
      '#ff9c4d',
      '#ff9c4d', // Pair 4
      '#ffad66',
      '#ffad66', // Pair 5
    ]
    return colors[index] || colors[colors.length - 1]
  }

  // Update the sponsorsChartData configuration
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
        backgroundColor: Array.from({ length: 10 }, (_, i) => getEnhancedBarColors(i)),
        borderRadius: 6,
        barThickness: 16,
      },
    ],
  }

  // Process data for activity timeline
  const timelineDataMap = filteredAds.reduce((acc, ad) => {
    const date = format(new Date(ad.date), 'MMM d')
    const company = ad.company.name
    
    if (!acc[date]) acc[date] = {}
    acc[date][company] = (acc[date][company] || 0) + 1
    
    return acc
  }, {} as Record<string, Record<string, number>>)

  const top5Companies = Object.entries(sponsorsData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name]) => name)

  // Add this function to process data for weekly view
  function getWeeklyData(timelineDataMap: WeeklyDataMap, companies: string[]): WeeklyDataMap {
    const weeklyData: WeeklyDataMap = {}
    
    Object.entries(timelineDataMap).forEach(([date, data]) => {
      const weekStart = format(startOfWeek(new Date(date)), 'MMM d')
      
      if (!weeklyData[weekStart]) {
        weeklyData[weekStart] = companies.reduce((acc, company) => ({
          ...acc,
          [company]: 0
        }), {})
      }
      
      companies.forEach(company => {
        weeklyData[weekStart][company] += data[company] || 0
      })
    })
    
    // Sort the data by date
    const sortedData = Object.entries(weeklyData)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .reduce((acc, [date, data]) => ({
        ...acc,
        [date]: data
      }), {})
    
    return sortedData
  }

  // Update the timeline chart data configuration
  const timelineChartData: ChartData<'bar'> = {
    labels: Object.keys(getWeeklyData(timelineDataMap, top5Companies)),
    datasets: top5Companies.map((company, index) => {
      const colors = getLineColors(index)
      const weeklyData: WeeklyDataMap = getWeeklyData(timelineDataMap, top5Companies)
      
      return {
        label: company,
        data: Object.values(weeklyData).map(week => week[company]),
        backgroundColor: colors.line,
        borderRadius: 4,
        borderSkipped: false,
      }
    }),
  }

  const stackedBarOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            weight: 'normal',
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
        bodyFont: { size: 14 },
        titleFont: { size: 14, weight: 'bold' },
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw} ads`,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: {
          color: chartColors.muted,
          font: { size: 11 },
        },
        border: { display: false },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: chartColors.grid,
          lineWidth: 1,
        },
        border: { display: false },
        ticks: {
          color: chartColors.muted,
          font: { size: 11 },
          padding: 8,
        },
      },
    },
  }

  // Process data for category breakdown
  const categoryData = filteredAds.reduce((acc, ad) => {
    ad.company.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  const sortedCategories = Object.entries(categoryData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)

  // Update the categoryChartData configuration
  const categoryChartData: ChartData<'bar'> = {
    labels: sortedCategories.map(([name]) => name),
    datasets: [
      {
        label: 'Ads',
        data: sortedCategories.map(([, count]) => count),
        backgroundColor: Array.from({ length: 10 }, (_, i) => getEnhancedBarColors(i)),
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
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: chartColors.muted,
          font: {
            size: 11,
            weight: 'normal',
          },
          padding: 8,
        },
      },
    },
  }

  const viewOptions = {
    sponsors: {
      title: 'Top Advertisers',
      description: `Top 10 most frequent advertisers in ${newsletter.name}`
    },
    activity: {
      title: 'Weekly Activity',
      description: 'Advertising frequency by company per week'
    },
    categories: {
      title: 'Industry Breakdown',
      description: 'Distribution of ads by top 10 advertiser industries',
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
        <div className="flex items-center gap-4">
          <ChartDateRangePicker
            from={dateRange.from}
            to={dateRange.to}
            onChange={onDateRangeChange || (() => {})}
          />
          <Select
            value={view}
            onValueChange={(value) => setView(value as ViewType)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activity">Activity Timeline</SelectItem>
              <SelectItem value="sponsors">Top Advertisers</SelectItem>
              <SelectItem value="categories">Industry Breakdown</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[300px]">
        {view === 'sponsors' && (
          <Bar data={sponsorsChartData} options={barOptions} />
        )}

        {view === 'activity' && (
          <Bar data={timelineChartData} options={stackedBarOptions} />
        )}

        {view === 'categories' && (
          <Bar data={categoryChartData} options={barOptions} />
        )}
      </div>
    </Card>
  )
} 