'use client'

import { useAdsState } from '@/hooks/useAdsState'
import { TableView } from './components/TableView'

export default function AdsPage() {
  const {
    filters,
    setFilters,
    sort,
    setSort,
    pagination,
    setPagination,
    view,
    setView
  } = useAdsState()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Newsletter Ad Library</h1>
      
      {/* TODO: Add filter components here */}
      
      <div className="mt-8">
        <TableView
          filters={filters}
          sort={sort}
          onSort={setSort}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      </div>
    </div>
  )
} 