'use client'

import { Ad, FilterState, PaginationState } from '@/types/ads'
import { AdCard } from './Card'
import { Pagination } from '@/components/Pagination'

interface CardViewProps {
  filters: FilterState
  pagination: PaginationState
  onPaginationChange: (pagination: Partial<PaginationState>) => void
  onTagClick?: (tag: string) => void
  data: { data: Ad[]; total: number } | undefined
  loading: boolean
  error: Error | null
}

export function CardView({
  pagination,
  onPaginationChange,
  onTagClick,
  data,
  loading,
  error,
}: CardViewProps) {

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load ads. Please try again.
      </div>
    )
  }

  if (!data?.data.length && !loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No ads found. Try adjusting your filters.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: pagination.pageSize }).map((_, i) => (
            <div
              key={i}
              className="h-[300px] bg-muted animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.data.map((ad) => (
              <AdCard key={ad.id} ad={ad} onTagClick={onTagClick} />
            ))}
          </div>
          {data && (
            <Pagination
              pagination={pagination}
              onPaginationChange={onPaginationChange}
              total={data.total}
              className="border-t"
            />
          )}
        </>
      )}
    </div>
  )
}
