'use client'

import { addDays, format, startOfDay, subDays } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

const presets = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
]

interface DateRangePickerProps {
  from: Date | null
  to: Date | null
  onChange: (from: Date | null, to: Date | null) => void
  align?: 'start' | 'center' | 'end'
}

export function ChartDateRangePicker({ 
  from, 
  to, 
  onChange,
  align = 'end'
}: DateRangePickerProps) {
  const selected = {
    from: from ? startOfDay(from) : undefined,
    to: to ? startOfDay(to) : undefined,
  }

  const handlePresetChange = (days: number) => {
    const to = startOfDay(new Date())
    const from = subDays(to, days - 1)
    onChange(from, to)
  }

  const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range) {
      onChange(null, null)
      return
    }

    if (range.from && range.to && range.from > range.to) {
      onChange(range.to, range.from)
      return
    }

    onChange(range.from || null, range.to || null)
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        onValueChange={(value) => handlePresetChange(Number(value))}
        defaultValue="30"
      >
        <SelectTrigger className="h-8 w-[130px]">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          {presets.map((preset) => (
            <SelectItem key={preset.days} value={preset.days.toString()}>
              {preset.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'h-8 justify-start text-left font-normal',
              !from && !to && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {from ? (
              to ? (
                <>
                  {format(from, 'LLL dd, y')} - {format(to, 'LLL dd, y')}
                </>
              ) : (
                format(from, 'LLL dd, y')
              )
            ) : (
              <span>Pick dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            mode="range"
            defaultMonth={from || new Date()}
            selected={selected}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={(date) => {
              const maxPast = subDays(new Date(), 90)
              return date < maxPast || date > new Date()
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
} 