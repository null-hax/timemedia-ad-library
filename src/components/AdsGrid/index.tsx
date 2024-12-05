'use client'

import { useAdsState } from '@/hooks/useAdsState'
import { useAds } from '@/hooks/useAds'
import { TableView } from '@/components/TableView'
import { CardView } from '@/components/CardView'
import { ViewToggle } from '@/components/ViewToggle'
import { Filters } from '@/components/Filters'
import { useMemo, useCallback, useEffect, useRef } from 'react'
import { DEFAULT_FILTER_STATE, FilterState } from '@/types/ads'

// Helper function to compare date objects
const areDatesEqual = (date1: Date | null, date2: Date | null): boolean => {
  if (!date1 && !date2) return true
  if (!date1 || !date2) return false
  return date1.getTime() === date2.getTime()
}

// Helper function to compare filter states
const areFiltersEqual = (filters1: Partial<FilterState>, filters2: Partial<FilterState>): boolean => {
  // Compare dateRange
  const dateRangeEqual = 
    areDatesEqual(filters1.dateRange?.from ?? null, filters2.dateRange?.from ?? null) &&
    areDatesEqual(filters1.dateRange?.to ?? null, filters2.dateRange?.to ?? null)
  
  // Compare arrays
  const tagsEqual = 
    (filters1.tags?.length ?? 0) === (filters2.tags?.length ?? 0) &&
    (filters1.tags ?? []).every(tag => filters2.tags?.includes(tag))
  
  const newsletterIdsEqual = 
    (filters1.newsletterIds?.length ?? 0) === (filters2.newsletterIds?.length ?? 0) &&
    (filters1.newsletterIds ?? []).every(id => filters2.newsletterIds?.includes(id))
  
  // Compare simple properties
  const simplePropsEqual = 
    filters1.search === filters2.search &&
    filters1.companyId === filters2.companyId &&
    filters1.newsletterId === filters2.newsletterId

  return dateRangeEqual && tagsEqual && newsletterIdsEqual && simplePropsEqual
}

interface AdsGridProps {
  initialFilters?: Partial<FilterState>
  showFilters?: boolean
  showViewToggle?: boolean
  className?: string
}

export function AdsGrid({ 
  initialFilters = {}, 
  showFilters = true,
  showViewToggle = true,
  className = ''
}: AdsGridProps) {
  const {
    filters,
    setFilters,
    sort,
    setSort,
    pagination,
    setPagination,
    view,
    setView,
  } = useAdsState(initialFilters)

  const prevInitialFiltersRef = useRef(initialFilters)

  // Update filters when initialFilters change
  useEffect(() => {
    // Skip if the filters haven't actually changed
    if (areFiltersEqual(prevInitialFiltersRef.current, initialFilters)) {
      return
    }

    setFilters({
      ...DEFAULT_FILTER_STATE,
      ...initialFilters
    })

    // Update ref
    prevInitialFiltersRef.current = initialFilters
  }, [initialFilters, setFilters])

  // Memoize the query parameters
  const queryParams = useMemo(() => ({
    filters,
    sort,
    pagination,
  }), [filters, sort, pagination])

  // Fetch data using memoized params
  const { data, loading, error } = useAds(queryParams)

  const handleTagClick = useCallback((tag: string) => {
    const currentTags = filters.tags || []
    if (!currentTags.includes(tag)) {
      setFilters({
        ...filters,
        tags: [...currentTags, tag],
      })
    }
  }, [filters, setFilters])

  // Memoize the shared props for both views
  const viewProps = useMemo(() => ({
    data: data ?? undefined,
    loading,
    error,
    filters,
    pagination,
    onPaginationChange: setPagination,
    onTagClick: handleTagClick,
  }), [data, loading, error, filters, pagination, setPagination, handleTagClick])

  return (
    <div className={className}>
      {showFilters && <Filters filters={filters} onChange={setFilters} />}
      <div className="container mx-auto py-8">
        <div className="space-y-6">
          {showViewToggle && (
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold mb-6">Recent Ads</h2>
              <ViewToggle value={view} onChange={setView} />
            </div>
          )}
          {view === 'table' ? (
            <TableView
              {...viewProps}
              sort={sort}
              onSort={setSort}
            />
          ) : (
            <CardView {...viewProps} />
          )}
        </div>
      </div>
    </div>
  )
} 