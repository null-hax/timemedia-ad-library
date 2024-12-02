'use client'

import { Input } from '@/components/ui/input'
import { DateRangePicker } from './DateRangePicker'
import { RangeFilter } from './RangeFilter'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import type { FilterState } from '@/types/ads'

interface FiltersProps {
  filters: FilterState
  onChange: (filters: Partial<FilterState>) => void
}

export function Filters({ filters, onChange }: FiltersProps) {
  const hasActiveFilters =
    filters.search ||
    filters.dateRange.from ||
    filters.dateRange.to ||
    filters.mentionsRange.min ||
    filters.mentionsRange.max ||
    filters.newsletterCount.min ||
    filters.newsletterCount.max

  const handleClearFilters = () => {
    onChange({
      search: '',
      dateRange: { from: null, to: null },
      mentionsRange: { min: null, max: null },
      newsletterCount: { min: null, max: null },
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear filters
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Search</label>
          <Input
            placeholder="Search companies or ad copy..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Date Range</label>
          <DateRangePicker
            from={filters.dateRange.from}
            to={filters.dateRange.to}
            onChange={(from, to) => onChange({ dateRange: { from, to } })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Mentions</label>
          <RangeFilter
            min={filters.mentionsRange.min}
            max={filters.mentionsRange.max}
            onChange={(min, max) => onChange({ mentionsRange: { min, max } })}
            placeholder="Enter mentions count..."
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Newsletters</label>
          <RangeFilter
            min={filters.newsletterCount.min}
            max={filters.newsletterCount.max}
            onChange={(min, max) => onChange({ newsletterCount: { min, max } })}
            placeholder="Enter newsletter count..."
          />
        </div>
      </div>
    </div>
  )
}
