'use client'

import { useState } from 'react'
import {
  addMonths,
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from 'date-fns'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CalendarProps {
  selected?: { from?: Date; to?: Date }
  onSelect: (range: { from?: Date; to?: Date }) => void
}

export function Calendar({ selected, onSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selecting, setSelecting] = useState<'from' | 'to'>('from')

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  const handleDateClick = (date: Date) => {
    if (selecting === 'from') {
      onSelect({ from: date, to: undefined })
      setSelecting('to')
    } else {
      if (selected?.from && date < selected.from) {
        onSelect({ from: date, to: selected.from })
      } else {
        onSelect({ from: selected?.from, to: date })
      }
      setSelecting('from')
    }
  }

  const isSelected = (date: Date) => {
    if (!selected?.from && !selected?.to) return false
    if (
      selected.from &&
      format(date, 'yyyy-MM-dd') === format(selected.from, 'yyyy-MM-dd')
    )
      return true
    if (
      selected.to &&
      format(date, 'yyyy-MM-dd') === format(selected.to, 'yyyy-MM-dd')
    )
      return true
    if (
      selected.from &&
      selected.to &&
      date > selected.from &&
      date < selected.to
    )
      return true
    return false
  }

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentMonth((prev) => addMonths(prev, -1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold">{format(currentMonth, 'MMMM yyyy')}</div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
        {days.map((day) => (
          <Button
            key={day.toISOString()}
            variant={isSelected(day) ? 'default' : 'ghost'}
            className={`h-8 w-8 p-0 ${isSelected(day) ? 'bg-primary text-primary-foreground' : ''}`}
            onClick={() => handleDateClick(day)}
          >
            {format(day, 'd')}
          </Button>
        ))}
      </div>
    </div>
  )
}
