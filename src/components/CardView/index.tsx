'use client'

import { useAds } from '@/hooks/useAds'
import { AdCard } from './Card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { FilterState, SortState, PaginationState } from '@/types/ads'

interface CardViewProps {
  filters: FilterState
  sort: SortState
  pagination: PaginationState
  onPaginationChange: (pagination: Partial<PaginationState>) => void
}

export function CardView({
  filters,
  sort,
  pagination,
  onPaginationChange
}: CardViewProps) {
  const { data, loading, error } = useAds({ filters, sort, pagination })

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load ads. Please try again.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: pagination.pageSize }).map((_, i) => (
          <div key={i} className="h-[200px] bg-muted animate-pulse rounded-lg" />
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.data.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>

      <div className="flex items-center justify-between px-4 py-2 border-t">
        <div className="flex items-center gap-2">
          <Select
            value={pagination.pageSize.toString()}
            onValueChange={(value) => 
              onPaginationChange({ pageSize: Number(value), page: 1 })
            }
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            Total: {data.total} ads
          </span>
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
            Page {pagination.page} of {Math.ceil(data.total / pagination.pageSize)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= Math.ceil(data.total / pagination.pageSize)}
            onClick={() => onPaginationChange({ page: pagination.page + 1 })}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
} 