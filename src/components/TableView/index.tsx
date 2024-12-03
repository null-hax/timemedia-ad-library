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
import { Pagination } from '@/components/Pagination'

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

const LoadingRow = () => (
  <TableRow>
    <TableCell colSpan={4}>
      <div className="flex items-center space-x-4">
        <div className="h-12 w-[200px] bg-muted animate-pulse rounded" />
        <div className="h-8 flex-1 bg-muted animate-pulse rounded" />
        <div className="h-8 w-[100px] bg-muted animate-pulse rounded" />
        <div className="h-8 w-[100px] bg-muted animate-pulse rounded" />
      </div>
    </TableCell>
  </TableRow>
)

const ErrorState = ({ error }: { error: Error }) => (
  <TableRow>
    <TableCell colSpan={4} className="text-center py-8 text-red-500">
      <div className="space-y-2">
        <p>Failed to load ads.</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    </TableCell>
  </TableRow>
)

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
    return <ErrorState error={error} />
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: pagination.pageSize }).map((_, i) => (
          <LoadingRow key={i} />
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
                role={column.sortable ? 'button' : undefined}
                aria-sort={
                  sort.field === column.id
                    ? sort.direction === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
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
      {data && (
        <Pagination
          pagination={pagination}
          onPaginationChange={onPaginationChange}
          total={data.total}
          className="border-t bg-muted/50 px-4"
        />
      )}
    </div>
  )
}
