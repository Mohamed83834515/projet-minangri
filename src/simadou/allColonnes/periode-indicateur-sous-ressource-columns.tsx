import type { ColumnDef } from '@tanstack/react-table'
import { ExternalLink } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/data-table'
import { buildEditDeleteActionsColumn } from '@/Global/Tableaux/buildEditDeleteActionsColumn'
import type {
  DocumentationCmrEnregistrement,
  FondCarteEnregistrement,
  PeriodeSousRessourceEnregistrement,
  PeriodeSousRessourceType,
} from '@/simadou/allTypes/periodeIndicateurSousRessource'
import {
  resolveDocumentFileName,
  resolveDocumentList,
  resolveDocumentUrl,
} from '@/simadou/lib/documentProjetUtils'

function DocumentLinksCell({ document }: { document: unknown }) {
  const documents = resolveDocumentList(document)

  if (documents.length === 0) {
    return <span className='text-sm text-muted-foreground'>—</span>
  }

  return (
    <div className='flex max-w-[14rem] flex-col gap-1'>
      {documents.map((doc, index) => {
        const href = resolveDocumentUrl(doc)
        const label = resolveDocumentFileName(doc)

        if (!href) {
          return (
            <span key={`${doc}-${index}`} className='truncate text-sm'>
              {label}
            </span>
          )
        }

        return (
          <a
            key={`${doc}-${index}`}
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1.5 truncate text-sm font-medium text-primary hover:underline'
          >
            <ExternalLink className='h-3.5 w-3.5 shrink-0' />
            {label}
          </a>
        )
      })}
    </div>
  )
}

export function buildPeriodeIndicateurSousRessourceColumns({
  resource,
  onEdit,
  onDeleteRequest,
}: {
  resource: PeriodeSousRessourceType
  onEdit: (row: PeriodeSousRessourceEnregistrement) => void
  onDeleteRequest: (row: PeriodeSousRessourceEnregistrement) => void
}): ColumnDef<PeriodeSousRessourceEnregistrement>[] {
  const commonColumns: ColumnDef<PeriodeSousRessourceEnregistrement>[] = [
    {
      accessorKey: 'source_donnees',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Source de données' />
      ),
      cell: ({ row }) => (
        <span className='line-clamp-1 max-w-[12rem] text-sm'>
          {row.original.source_donnees || '—'}
        </span>
      ),
    },
    {
      accessorKey: 'date_validation',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Date validation' />
      ),
      cell: ({ row }) => row.original.date_validation || '—',
    },
    {
      accessorKey: 'observation',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Observations' />
      ),
      cell: ({ row }) => (
        <span className='line-clamp-1 max-w-[12rem] text-sm'>
          {row.original.observation || '—'}
        </span>
      ),
    },
  ]

  const documentColumn: ColumnDef<PeriodeSousRessourceEnregistrement> = {
    accessorKey: 'document',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Documents' />
    ),
    cell: ({ row }) => (
      <DocumentLinksCell
        document={
          resource === 'documentations'
            ? (row.original as DocumentationCmrEnregistrement).document
            : (row.original as FondCarteEnregistrement).document
        }
      />
    ),
  }

  const documentationColumns: ColumnDef<PeriodeSousRessourceEnregistrement>[] =
    [
      {
        accessorKey: 'titre',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Titre' />
        ),
        cell: ({ row }) =>
          (row.original as DocumentationCmrEnregistrement).titre || '—',
      },
      documentColumn,
    ]

  const fondCarteColumns: ColumnDef<PeriodeSousRessourceEnregistrement>[] = [
    documentColumn,
  ]

  const columns =
    resource === 'documentations'
      ? [...documentationColumns, ...commonColumns]
      : resource === 'fonds-carte'
        ? [...fondCarteColumns, ...commonColumns]
        : commonColumns

  return [
    ...columns,
    buildEditDeleteActionsColumn<PeriodeSousRessourceEnregistrement>({
      onEdit,
      onDeleteRequest,
    }),
  ]
}
