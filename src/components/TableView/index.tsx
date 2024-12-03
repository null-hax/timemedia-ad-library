'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import type { Ad, FilterState, SortState, PaginationState } from '@/types/ads'
import { NewsletterListModal } from '@/components/NewsletterListModal'

interface TableViewProps {
  filters: FilterState
  sort: SortState
  onSort: (sort: SortState) => void
  pagination: PaginationState
  onPaginationChange: (pagination: Partial<PaginationState>) => void
  onTagClick?: (tag: string) => void
  data: { data: Ad[]; total: number } | undefined
  loading: boolean
  error: Error | null
}

export function TableView({
  filters,
  sort,
  onSort,
  pagination,
  onPaginationChange,
  onTagClick,
  data,
  loading,
  error,
}: TableViewProps) {
  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load ads. Please try again.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: pagination.pageSize }).map((_, i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded" />
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

  const columns = [
    {
      id: 'companyName' as const,
      header: 'Company',
      sortable: true,
      render: (row: Ad) => (
        <div className="space-y-1.5">
          <Link
            href={`/company/${row.company.slug}`}
            className="text-base font-medium hover:text-blue-600 transition-colors"
          >
            {row.companyName}
          </Link>
          <div className="flex flex-wrap gap-1.5">
            {row.company.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs px-2 py-0.5 cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={() => onTagClick?.(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'adCopy' as const,
      header: 'Ad Copy',
      sortable: false,
      render: (row: Ad) => (
        <div 
          className="max-w-md text-sm text-muted-foreground line-clamp-2" 
          title={row.adCopy}
        >
          {row.adCopy}
        </div>
      ),
    },
    {
      id: 'date' as const,
      header: 'Date Seen',
      sortable: true,
      render: (row: Ad) => (
        <div className="whitespace-nowrap text-sm text-muted-foreground">
          {formatDate(row.date)}
        </div>
      ),
    },
    {
      id: 'newsletters' as const,
      header: 'Reach',
      sortable: true,
      render: (row: Ad) => {
        const sortedNewsletters = [...row.newsletters].sort(
          (a, b) => a.traffic_rank - b.traffic_rank
        )

        return (
          <NewsletterListModal newsletters={sortedNewsletters}>
            <button className="group flex items-center gap-2 hover:text-blue-600 transition-colors">
              <span className="font-semibold text-lg">
                {row.newsletters.length}
              </span>
              <span className="text-sm text-muted-foreground group-hover:text-blue-600/75">
                {row.newsletters.length === 1 
                  ? 'newsletter' 
                  : 'newsletters'
                }
              </span>
            </button>
          </NewsletterListModal>
        )
      },
    },
  ]

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-muted/50">
            {columns.map((column) => (
              <TableHead
                key={column.id}
                className={`${
                  column.sortable ? 'cursor-pointer' : ''
                } bg-muted/50 h-11`}
                onClick={() => {
                  if (column.sortable) {
                    onSort({
                      field: column.id,
                      direction:
                        sort.field === column.id && sort.direction === 'asc'
                          ? 'desc'
                          : 'asc',
                    })
                  }
                }}
              >
                <div className="flex items-center gap-2 font-medium">
                  {column.header}
                  {column.sortable && sort.field === column.id && (
                    <span className="text-muted-foreground">
                      {sort.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((row) => (
            <TableRow 
              key={row.id}
              className="hover:bg-muted/50 transition-colors"
            >
              {columns.map((column) => (
                <TableCell 
                  key={column.id} 
                  className="py-4"
                >
                  {column.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/50">
        <div className="flex items-center gap-3">
          <Select
            value={pagination.pageSize.toString()}
            onValueChange={(value) =>
              onPaginationChange({ pageSize: Number(value), page: 1 })
            }
          >
            <SelectTrigger className="w-[115px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size} per page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            Total: {data.total} ads
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page === 1}
            onClick={() => onPaginationChange({ page: pagination.page - 1 })}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
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
