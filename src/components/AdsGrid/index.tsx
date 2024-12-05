'use client'

import { useAdsState } from '@/hooks/useAdsState'
import { useAds } from '@/hooks/useAds'
import { TableView } from '@/components/TableView'
import { CardView } from '@/components/CardView'
import { ViewToggle } from '@/components/ViewToggle'
import { Filters } from '@/components/Filters'
import { useMemo, useCallback } from 'react'
import { FilterState } from '@/types/ads'

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