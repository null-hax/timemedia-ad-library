'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PaginationState } from '@/types/ads'

interface PaginationProps {
  pagination: PaginationState
  onPaginationChange: (pagination: Partial<PaginationState>) => void
  total: number
  pageSizeOptions?: number[]
  className?: string
}

export function Pagination({
  pagination,
  onPaginationChange,
  total,
  pageSizeOptions = [12, 24, 36, 48],
  className = ''
}: PaginationProps) {
  return (
    <div className={`flex items-center justify-between py-4 ${className}`}>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Show: </span>
        <Select
          value={pagination.pageSize.toString()}
          onValueChange={(value) =>
            onPaginationChange({ pageSize: Number(value), page: 1 })
          }
        >
          <SelectTrigger className="w-[70px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          Total: {total} ads
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          disabled={pagination.page === 1}
          onClick={() => onPaginationChange({ page: pagination.page - 1 })}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {pagination.page} of {Math.ceil(total / pagination.pageSize)}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          disabled={pagination.page >= Math.ceil(total / pagination.pageSize)}
          onClick={() => onPaginationChange({ page: pagination.page + 1 })}
        >
          Next
        </Button>
      </div>
    </div>
  )
} 