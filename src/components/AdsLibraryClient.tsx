'use client'

import { TableView } from '@/components/TableView'
import { CardView } from '@/components/CardView'
import { Filters } from '@/components/Filters'
import { ViewToggle } from '@/components/ViewToggle'
import { Hero } from '@/components/Hero'
import { useAdsState } from '@/hooks/useAdsState'
import { useAds } from '@/hooks/useAds'
import { useCallback } from 'react'

export default function AdsLibraryClient() {
  const {
    filters,
    setFilters,
    sort,
    setSort,
    pagination,
    setPagination,
    view,
    setView,
  } = useAdsState()

  // Fetch data at the parent level to share between views
  const { data, loading, error } = useAds({
    filters,
    sort,
    pagination,
  })

  const handleTagClick = useCallback((tag: string) => {
    const currentTags = filters.tags || []
    if (!currentTags.includes(tag)) {
      setFilters({
        ...filters,
        tags: [...currentTags, tag],
      })
    }
  }, [filters, setFilters])

  return (
    <div className="min-h-screen">
      <Hero />
      <Filters filters={filters} onChange={setFilters} />
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex justify-end">
          <ViewToggle value={view} onChange={setView} />
        </div>
        {view === 'table' ? (
          <TableView
            filters={filters}
            sort={sort}
            onSort={setSort}
            pagination={pagination}
            onPaginationChange={setPagination}
            onTagClick={handleTagClick}
            data={data}
            loading={loading}
            error={error}
          />
        ) : (
          <CardView
            filters={filters}
            pagination={pagination}
            onPaginationChange={setPagination}
            onTagClick={handleTagClick}
            data={data}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </div>
  )
} 