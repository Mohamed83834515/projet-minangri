import { useEffect, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'
import {
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { TableLoadingOverlay } from './table-loading-overlay'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

// ─── Types ───────────────────────────────────────────────────────────────────

export type ColumnFilterConfig = {
  columnId: string
  searchKey: string
  type: 'string' | 'array'
}

export type FacetedFilterOption = {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export type FacetedFilter = {
  columnId: string
  title: string
  options: FacetedFilterOption[]
}

type GenericTableProps<TData> = {
  data: TData[]
  columns: ColumnDef<TData>[]

  search: Record<string, unknown>
  navigate: NavigateFn

  searchKey?: string
  searchPlaceholder?: string

  urlFilterConfig?: ColumnFilterConfig[]
  facetedFilters?: FacetedFilter[]

  bulkActionsSlot?: (table: ReturnType<typeof useReactTable<TData>>) => React.ReactNode

  defaultPageSize?: number

  emptyMessage?: string

  showViewOptions?: boolean
  showSearch?: boolean
  showPagination?: boolean
  toolbarEndSlot?: React.ReactNode

  onRowClick?: (row: TData) => void

  isLoading?: boolean

  initialState?: Partial<{
    columnVisibility: Record<string, boolean>
    sorting: SortingState
  }>
}

// ─── Component ───────────────────────────────────────────────────────────────

export function GenericTable<TData>({
  data,
  columns,
  search,
  navigate,
  searchKey,
  searchPlaceholder = 'Filtrer...',
  urlFilterConfig = [],
  facetedFilters = [],
  bulkActionsSlot,
  defaultPageSize = 10,
  emptyMessage = 'Aucun résultat.',
  showViewOptions = true,
  showSearch = true,
  showPagination = true,
  toolbarEndSlot,
  onRowClick,
  isLoading: isLoadingProp = false,
  initialState,
}: GenericTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialState?.columnVisibility ?? {}
  )
  const [sorting, setSorting] = useState<SortingState>(
    initialState?.sorting ?? []
  )

  const routerState = useRouterState()
  const isRouterPending = routerState.status === 'pending'
  const isLoading = isRouterPending || isLoadingProp

  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize },
    globalFilter: { enabled: false },
    columnFilters: urlFilterConfig,
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
      columnVisibility,
    },
    enableRowSelection: true,
    onPaginationChange,
    onColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  useEffect(() => {
    ensurePageInRange(table.getPageCount())
  }, [table, ensurePageInRange])

  return (
    <div className="flex flex-1 flex-col gap-5">

      <DataTableToolbar
        table={table}
        searchPlaceholder={searchPlaceholder}
        searchKey={searchKey}
        filters={facetedFilters}
        showViewOptions={showViewOptions}
        showSearch={showSearch}
        toolbarEndSlot={toolbarEndSlot}
      />

      <div
        className={cn(
          "group relative overflow-hidden rounded-2xl",
          "border border-border/60",
          "bg-gradient-to-b from-background to-muted/10",
          "shadow-sm transition-all duration-300",
          "hover:shadow-xl hover:shadow-primary/5"
        )}
      >
        {isLoadingProp && <TableLoadingOverlay />}

        <ScrollArea className="w-full">

          <div className="min-w-full">

            <Table
              className={cn(
                "w-full transition duration-300",
                isLoading && "pointer-events-none opacity-50"
              )}
            >

              {/* HEADER */}

              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className='border-b-2 border-emerald-200 dark:border-emerald-800 bg-muted/30 dark:bg-muted/10'
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        style={{
                          width: (header.column.columnDef.meta as any)?.width,
                          minWidth: (header.column.columnDef.meta as any)?.minWidth || 100,
                        }}
                        className={cn(
                          'py-3 px-4 text-xs font-semibold uppercase tracking-wide',
                          'text-slate-600 dark:text-slate-300',
                          'border-r border-border/30 last:border-r-0',
                          'first:rounded-tl-lg last:rounded-tr-lg',
                          'bg-muted/20 dark:bg-muted/5',
                          (header.column.columnDef.meta as any)?.className,
                          (header.column.columnDef.meta as any)?.thClassName
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              {/* BODY */}

              <TableBody>

                {table.getRowModel().rows.length ? (
                  table
                    .getRowModel()
                    .rows
                    .map((row, index) => (
                      <TableRow
                        key={row.id}
                        data-state={
                          row.getIsSelected() &&
                          "selected"
                        }
                        onClick={() =>
                          onRowClick?.(
                            row.original
                          )
                        }
                        className={cn(
                          "group transition-all duration-200",

                          index % 2 === 0
                            ? "bg-background"
                            : "bg-muted/[0.03]",

                          "hover:bg-primary/[0.04]",

                          "border-b border-border/40",

                          onRowClick &&
                          "cursor-pointer",

                          row.getIsSelected() &&
                          "bg-primary/10"
                        )}
                      >
                        {row
                          .getVisibleCells()
                          .map((cell) => (
                            <TableCell
                              key={cell.id}
                              style={{
                                width:
                                  (cell.column
                                    .columnDef
                                    .meta as any)
                                    ?.width,

                                minWidth:
                                  (cell.column
                                    .columnDef
                                    .meta as any)
                                    ?.minWidth ||
                                  100,
                              }}
                              className={cn(
                                "px-5 py-4",

                                "text-sm",

                                "align-middle",

                                "border-r border-border/20 last:border-r-0",

                                "group-hover:border-primary/10",

                                (cell.column
                                  .columnDef
                                  .meta as any)
                                  ?.tdClassName
                              )}
                            >
                              <div className="break-words leading-relaxed">
                                {flexRender(
                                  cell.column
                                    .columnDef.cell,
                                  cell.getContext()
                                )}
                              </div>
                            </TableCell>
                          ))}
                      </TableRow>
                    ))
                ) : (

                  <TableRow>

                    <TableCell
                      colSpan={columns.length}
                      className="h-[340px]"
                    >

                      <div className="flex h-full flex-col items-center justify-center gap-5">

                        <div
                          className={cn(
                            "rounded-2xl",
                            "bg-muted/30",
                            "p-6"
                          )}
                        >
                          <svg
                            className="h-10 w-10 text-muted-foreground"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.4}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>

                        <div className="space-y-1 text-center">

                          <p className="font-medium">
                            Aucun résultat
                          </p>

                          <p className="text-sm text-muted-foreground">
                            {emptyMessage}
                          </p>

                        </div>

                      </div>

                    </TableCell>

                  </TableRow>

                )}

              </TableBody>

            </Table>

          </div>

          <ScrollBar orientation="horizontal" />

        </ScrollArea>

      </div>

      {showPagination && (
        <div
          className={cn(
            "rounded-xl",
            "border border-border/50",
            "bg-muted/[0.03]",
            "p-2"
          )}
        >
          <DataTablePagination
            table={table}
          />
        </div>
      )}

      {bulkActionsSlot?.(table)}

    </div>
  )
}