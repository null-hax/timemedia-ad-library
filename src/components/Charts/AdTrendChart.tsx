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
}

export function AdTrendChart({ data, days = 30 }: AdTrendChartProps) {
  // Generate date range
  const endDate = startOfDay(new Date())
  const startDate = subDays(endDate, days)
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate })

  // Process data
  const dailyCounts = dateRange.map((date) => {
    const dayAds = data.filter(
      (ad) => startOfDay(new Date(ad.date)).getTime() === date.getTime()
    )
    return dayAds.length
  })

  const chartData: ChartData<'line'> = {
    labels: dateRange.map((date) => format(date, 'MMM d')),
    datasets: [
      {
        label: 'Number of Ads',
        data: dailyCounts,
        borderColor: 'rgb(59, 130, 246)', // Blue
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
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
        callbacks: {
          title: (tooltipItems) => {
            const date = dateRange[tooltipItems[0].dataIndex]
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
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          precision: 0,
          stepSize: 1,
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
      <Line data={chartData} options={options} />
    </div>
  )
}
