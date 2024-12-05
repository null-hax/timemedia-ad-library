'use client'

import { format, startOfDay, subDays } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { DateRange } from 'react-day-picker'

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
  const selected: DateRange = {
    from: from ? startOfDay(from) : undefined,
    to: to ? startOfDay(to) : undefined,
  }

  const handleSelect = (range: DateRange | undefined) => {
    if (!range) {
      onChange(null, null)
      return
    }

    const { from: newFrom, to: newTo } = range

    // Allow selecting just the start date
    if (newFrom && !newTo) {
      onChange(newFrom, null)
      return
    }

    // When both dates are selected, ensure they're in order
    if (newFrom && newTo) {
      if (newFrom > newTo) {
        onChange(newTo, newFrom)
      } else {
        onChange(newFrom, newTo)
      }
    }
  }

  return (
    <div className="flex items-center">
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
            initialFocus
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