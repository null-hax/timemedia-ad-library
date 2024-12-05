'use client'

import { Input } from '@/components/ui/input'
import { ChartDateRangePicker } from '@/components/ui/date-range-picker'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import type { FilterState } from '@/types/ads'
import { companies, newsletters } from '@/lib/mock/generateMockData'
import { MultiSelect } from '@/components/ui/multi-select'
import { DEFAULT_FILTER_STATE } from '@/hooks/useAdsState'

interface FiltersProps {
  filters: FilterState
  onChange: (filters: Partial<FilterState>) => void
}

// Get unique tags from all companies
const allTags = Array.from(
  new Set(companies.flatMap((company) => company.tags))
).sort()

export function Filters({ filters, onChange }: FiltersProps) {
  const hasActiveFilters =
    filters.search ||
    (filters.dateRange?.from || filters.dateRange?.to) ||
    filters.newsletterIds.length > 0 ||
    filters.tags.length > 0

  const handleClearFilters = () => {
    onChange({ ...DEFAULT_FILTER_STATE })
  }

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag]

    onChange({ ...filters, tags: newTags })
  }

  const handleDateRangeChange = (from: Date | null, to: Date | null) => {
    onChange({
      ...filters,
      dateRange: { from, to }
    })
  }

  return (
    <div className="space-y-4 sticky top-0 bg-background z-10 py-6 shadow-sm">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear filters
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="text-sm font-medium mb-2 block">Date Range</label>
            <ChartDateRangePicker
              from={filters.dateRange.from}
              to={filters.dateRange.to}
              onChange={handleDateRangeChange}
              align="start"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Search</label>
            <Input
              placeholder="Search companies or ad copy..."
              value={filters.search}
              onChange={(e) => onChange({ ...filters, search: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Newsletters</label>
            <MultiSelect
              value={filters.newsletterIds}
              onValueChange={(value) => {
                onChange({ ...filters, newsletterIds: value })
              }}
              options={newsletters
                .sort((a, b) => a.traffic_rank - b.traffic_rank)
                .map((newsletter) => ({
                  value: newsletter.id,
                  label: newsletter.name,
                }))}
              placeholder="Select newsletters..."
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium mb-2 block">Tags</label>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={filters.tags.includes(tag) ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
