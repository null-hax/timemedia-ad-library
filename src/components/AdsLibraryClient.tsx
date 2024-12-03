'use client'

import { TableView } from '@/components/TableView'
import { CardView } from '@/components/CardView'
import { Filters } from '@/components/Filters'
import { ViewToggle } from '@/components/ViewToggle'
import { Hero } from '@/components/Hero'
import { useAdsState } from '@/hooks/useAdsState'

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

  const handleTagClick = (tag: string) => {
    const currentTags = filters.tags || []
    if (!currentTags.includes(tag)) {
      setFilters({
        ...filters,
        tags: [...currentTags, tag],
      })
    }
  }

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
          />
        ) : (
          <CardView
            filters={filters}
            pagination={pagination}
            onPaginationChange={setPagination}
            onTagClick={handleTagClick}
          />
        )}
      </div>
    </div>
  )
} 