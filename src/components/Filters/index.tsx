'use client'

import { Input } from '@/components/ui/input'
import { DateRangePicker } from './DateRangePicker'
import { RangeFilter } from './RangeFilter'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import type { FilterState } from '@/types/ads'
import { companies, newsletters } from '@/lib/mock/generateMockData'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { MultiSelect } from '@/components/ui/multi-select'

interface FiltersProps {
  filters: FilterState
  onChange: (filters: Partial<FilterState>) => void
}

// Get unique tags from all companies
const allTags = Array.from(
  new Set(companies.flatMap(company => company.tags))
).sort()

export function Filters({ filters, onChange }: FiltersProps) {
  const hasActiveFilters =
    filters.search ||
    filters.dateRange.from ||
    filters.dateRange.to ||
    filters.newsletterCount.min ||
    filters.newsletterCount.max ||
    (filters.tags && filters.tags.length > 0) ||
    filters.newsletters !== undefined

  const handleClearFilters = () => {
    onChange({
      search: '',
      dateRange: { from: null, to: null },
      newsletterCount: { min: null, max: null },
      tags: [],
      newsletters: undefined,
    })
  }

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || []
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag]
    
    onChange({ tags: newTags })
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
          <label className="text-sm font-medium mb-2 block">Date Range</label>
          <DateRangePicker
            from={filters.dateRange.from}
            to={filters.dateRange.to}
            onChange={(from, to) => onChange({ dateRange: { from, to } })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Search</label>
          <Input
            placeholder="Search companies, ad copy or newsletters..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Newsletters</label>
          <MultiSelect
            value={filters.newsletters || []}
            onValueChange={(value) => {
              onChange({ newsletters: value.length > 0 ? value : undefined })
            }}
            options={newsletters
              .sort((a, b) => a.traffic_rank - b.traffic_rank)
              .map(newsletter => ({
                value: newsletter.id,
                label: newsletter.name,
              }))}
            placeholder="Select newsletters..."
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Tags</label>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <Badge
              key={tag}
              variant={filters.tags?.includes(tag) ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
