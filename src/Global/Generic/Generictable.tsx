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

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Composant ────────────────────────────────────────────────────────────────

export function GenericTable<TData>({
  data,
  columns,
  search,
  navigate,
  searchKey,
  searchPlaceholder = 'Filtrer…',
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
  const [rowSelection,     setRowSelection    ] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialState?.columnVisibility ?? {}
  )
  const [sorting, setSorting] = useState<SortingState>(
    initialState?.sorting ?? []
  )

  const routerState    = useRouterState()
  const isRouterPending = routerState.status === 'pending'
  const isLoading      = isRouterPending || isLoadingProp

  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination:   { defaultPage: 1, defaultPageSize },
    globalFilter: { enabled: false },
    columnFilters: urlFilterConfig,
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination, rowSelection, columnFilters, columnVisibility },
    enableRowSelection: true,
    onPaginationChange,
    onColumnFiltersChange,
    onRowSelectionChange:    setRowSelection,
    onSortingChange:         setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel:   getPaginationRowModel(),
    getCoreRowModel:         getCoreRowModel(),
    getFilteredRowModel:     getFilteredRowModel(),
    getSortedRowModel:       getSortedRowModel(),
    getFacetedRowModel:      getFacetedRowModel(),
    getFacetedUniqueValues:  getFacetedUniqueValues(),
  })

  useEffect(() => {
    ensurePageInRange(table.getPageCount())
  }, [table, ensurePageInRange])

  return (
    <div className={cn('max-sm:has-[div[role="toolbar"]]:mb-16', 'flex flex-1 flex-col gap-4')}>

      {/* ── Toolbar ── */}
      <DataTableToolbar
        table={table}
        searchPlaceholder={searchPlaceholder}
        searchKey={searchKey}
        filters={facetedFilters}
        showViewOptions={showViewOptions}
        showSearch={showSearch}
        toolbarEndSlot={toolbarEndSlot}
      />

      {/* ── Table ── */}
      <div className='relative w-full min-w-0'>
        {isLoadingProp && <TableLoadingOverlay />}

        <div
          className={cn(
            'w-full rounded-xl border border-border/60 shadow-sm overflow-x-auto',

            isLoading && 'opacity-50 pointer-events-none select-none transition-opacity duration-200'
          )}
        >
          {/* ── En-tête de couleur ── */}
          <div className='h-1 w-full bg-primary' />

          <Table
            // "w-full" + pas de min-w ni overflow-x → la table s'adapte à la largeur disponible
            // Les colonnes se partagent l'espace et les cellules wrappent le texte si nécessaire
            className='w-full min-w-full table-auto border-collapse'
            style={{ tableLayout: 'auto' }}
          >
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className='border-b border-border/60 bg-muted/60 hover:bg-muted/60'
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        // Texte wrappé + padding confortable
                        'px-4 py-1.5 text-xs font-semibold uppercase tracking-wider',
                        'text-muted-foreground whitespace-normal break-words align-top',
                        // Séparateur entre colonnes
                        'border-r border-border/30 last:border-r-0',
                        header.column.columnDef.meta?.className,
                        header.column.columnDef.meta?.thClassName
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

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, rowIdx) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={cn(
                      'group/row border-b border-border/40 last:border-b-0',
                      'transition-colors duration-100',
                      // Zèbre léger
                      rowIdx % 2 === 0 ? 'bg-background' : 'bg-muted/20',
                      // Hover
                      'hover:bg-primary/5 data-[state=selected]:bg-primary/10',
                      onRowClick && 'cursor-pointer'
                    )}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          // Texte wrappé — jamais tronqué, jamais de scroll
                          'px-4 py-3 text-sm align-top [&_*]:!whitespace-normal [&_*]:!overflow-visible [&_*]:!text-clip',
                          'whitespace-normal break-words',
                          // Séparateur entre colonnes
                          'border-r border-border/20 last:border-r-0',
                          // Pas de bg propre → prend le bg de la ligne (zèbre + hover)
                          cell.column.columnDef.meta?.className,
                          cell.column.columnDef.meta?.tdClassName
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='py-16 text-center text-sm text-muted-foreground'
                  >
                    <div className='flex flex-col items-center gap-2'>
                      <div className='rounded-full bg-muted p-3'>
                        <svg className='h-5 w-5 text-muted-foreground' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5}
                            d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                        </svg>
                      </div>
                      <span>{emptyMessage}</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ── Pagination ── */}
      {showPagination && <DataTablePagination table={table} className='mt-auto' />}

      {bulkActionsSlot?.(table)}
    </div>
  )
}