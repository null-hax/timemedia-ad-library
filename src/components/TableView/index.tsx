'use client'

import { useAds } from '@/hooks/useAds'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import type { Ad, FilterState, SortState, PaginationState } from '@/types/ads'
import React from 'react'

interface TableViewProps {
  filters: FilterState
  sort: SortState
  onSort: (sort: SortState) => void
  pagination: PaginationState
  onPaginationChange: (pagination: Partial<PaginationState>) => void
}

export function TableView({
  filters,
  sort,
  onSort,
  pagination,
  onPaginationChange
}: TableViewProps) {
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
      render: (row: Ad) => <span className="font-medium">{row.companyName}</span>
    },
    {
      id: 'adCopy' as const,
      header: 'Ad Copy',
      sortable: false,
      render: (row: Ad) => (
        <div className="max-w-md truncate" title={row.adCopy}>
          {row.adCopy}
        </div>
      )
    },
    {
      id: 'mentions' as const,
      header: 'Mentions',
      sortable: true,
      render: (row: Ad) => row.mentions.toLocaleString()
    },
    {
      id: 'firstSeen' as const,
      header: 'First Seen',
      sortable: true,
      render: (row: Ad) => formatDate(row.firstSeen)
    },
    {
      id: 'lastSeen' as const,
      header: 'Last Seen',
      sortable: true,
      render: (row: Ad) => formatDate(row.lastSeen)
    },
    {
      id: 'newsletterCount' as const,
      header: 'Newsletters',
      sortable: true,
      render: (row: Ad) => row.newsletterCount.toLocaleString()
    }
  ]

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead 
                key={column.id}
                className={column.sortable ? 'cursor-pointer' : ''}
                onClick={() => {
                  if (column.sortable) {
                    onSort({
                      field: column.id,
                      direction: sort.field === column.id && sort.direction === 'asc' 
                        ? 'desc' 
                        : 'asc'
                    })
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  {column.header}
                  {column.sortable && sort.field === column.id && (
                    <span>{sort.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((row) => (
            <TableRow key={row.id}>
              {columns.map((column) => (
                <TableCell key={column.id}>
                  {column.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
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