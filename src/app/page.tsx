'use client'

import { useAdsState } from '@/hooks/useAdsState'
import { TableView } from '@/components/TableView'
import { CardView } from '@/components/CardView'
import { Filters } from '@/components/Filters'
import { Button } from '@/components/ui/button'
import { LayoutGrid, Table as TableIcon } from 'lucide-react'

export default function HomePage() {
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Newsletter Ad Library</h1>
        <div className="flex gap-2">
          <Button
            variant={view === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('table')}
          >
            <TableIcon className="h-4 w-4 mr-2" />
            Table
          </Button>
          <Button
            variant={view === 'card' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('card')}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Cards
          </Button>
        </div>
      </div>
      
      <div className="mb-8">
        <Filters filters={filters} onChange={setFilters} />
      </div>
      
      <div className="mt-8">
        {view === 'table' ? (
          <TableView
            filters={filters}
            sort={sort}
            onSort={setSort}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        ) : (
          <CardView
            filters={filters}
            sort={sort}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        )}
      </div>
    </div>
  )
}
