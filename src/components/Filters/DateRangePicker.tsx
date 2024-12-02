'use client'

import { format } from 'date-fns'
import { Calendar as CalendarIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DateRangePickerProps {
  from: string | null
  to: string | null
  onChange: (from: string | null, to: string | null) => void
}

export function DateRangePicker({ from, to, onChange }: DateRangePickerProps) {
  const selected = {
    from: from ? new Date(from) : undefined,
    to: to ? new Date(to) : undefined
  }

  const hasValue = from || to

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !hasValue && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {from ? (
              to ? (
                <>
                  {format(new Date(from), 'LLL dd, y')} - {format(new Date(to), 'LLL dd, y')}
                </>
              ) : (
                format(new Date(from), 'LLL dd, y')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            selected={selected}
            onSelect={(range) => {
              onChange(
                range?.from?.toISOString() || null,
                range?.to?.toISOString() || null
              )
            }}
          />
        </PopoverContent>
      </Popover>
      {hasValue && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={() => onChange(null, null)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
} 