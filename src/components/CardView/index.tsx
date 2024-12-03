'use client'

import { useAds } from '@/hooks/useAds'
import { Ad, FilterState, PaginationState, SortState } from '@/types/ads'
import { AdCard } from './Card'
import { Button } from '@/components/ui/button'
import { useMemo } from 'react'

interface CardViewProps {
  filters: FilterState
  pagination: PaginationState
  onPaginationChange: (pagination: Partial<PaginationState>) => void
  onTagClick?: (tag: string) => void
}

export function CardView({
  filters,
  pagination,
  onPaginationChange,
  onTagClick,
}: CardViewProps) {
  // Memoize the sort configuration to prevent unnecessary re-renders
  const sort = useMemo<SortState>(
    () => ({ field: 'date', direction: 'desc' }),
    []
  )

  const { data, loading, error } = useAds({
    filters,
    sort,
    pagination,
  })

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load ads. Please try again.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: pagination.pageSize }).map((_, i) => (
          <div
            key={i}
            className="h-[300px] bg-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
    )
  }

  if (!data?.data.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No ads found. Try adjusting your filters.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.data.map((ad) => (
          <AdCard key={ad.id} ad={ad} onTagClick={onTagClick} />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Total: {data.total} ads
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page === 1}
            onClick={() => onPaginationChange({ page: pagination.page - 1 })}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {pagination.page} of{' '}
            {Math.ceil(data.total / pagination.pageSize)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={
              pagination.page >= Math.ceil(data.total / pagination.pageSize)
            }
            onClick={() => onPaginationChange({ page: pagination.page + 1 })}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
