'use client'

import { Line } from 'react-chartjs-2'
import { Ad } from '@/types/ads'
import { format, startOfDay, eachDayOfInterval, subDays } from 'date-fns'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { chartColors } from '@/lib/utils/chartStyles'
import { ChartDateRangePicker } from '@/components/ui/date-range-picker'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface AdTrendChartProps {
  data: Ad[]
  days?: number
  onDateRangeChange?: (from: Date | null, to: Date | null) => void
  dateRange?: {
    from: Date | null
    to: Date | null
  }
}

export function AdTrendChart({ 
  data, 
  days = 30,
  onDateRangeChange,
  dateRange = { from: null, to: null }
}: AdTrendChartProps) {
  // Use dateRange if provided, otherwise fallback to days prop
  const endDate = dateRange.to ? startOfDay(dateRange.to) : startOfDay(new Date())
  const startDate = dateRange.from ? startOfDay(dateRange.from) : subDays(endDate, days)
  const dateInterval = eachDayOfInterval({ start: startDate, end: endDate })

  // Filter data based on date range
  const filteredData = data.filter(ad => {
    const adDate = startOfDay(new Date(ad.date))
    return adDate >= startDate && adDate <= endDate
  })

  // Process data
  const dailyCounts = dateInterval.map((date) => {
    const dayAds = filteredData.filter(
      (ad) => startOfDay(new Date(ad.date)).getTime() === date.getTime()
    )
    return dayAds.length
  })

  const chartData: ChartData<'line'> = {
    labels: dateInterval.map((date) => format(date, 'MMM d')),
    datasets: [
      {
        label: 'Number of Ads',
        data: dailyCounts,
        borderColor: chartColors.primary,
        backgroundColor: `${chartColors.primary}1A`, // 10% opacity
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
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
        callbacks: {
          title: (tooltipItems) => {
            const date = dateInterval[tooltipItems[0].dataIndex]
            return format(date, 'MMMM d, yyyy')
          },
          label: (context) => {
            return `${context.parsed.y} ads`
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 7,
          color: chartColors.muted,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: chartColors.grid,
        },
        ticks: {
          precision: 0,
          stepSize: 1,
          color: chartColors.muted,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  }

  return (
    <div className="w-full h-full">
      {onDateRangeChange && (
        <div className="flex justify-end mb-4">
          <ChartDateRangePicker
            from={dateRange.from}
            to={dateRange.to}
            onChange={onDateRangeChange}
          />
        </div>
      )}
      <Line data={chartData} options={options} />
    </div>
  )
}
