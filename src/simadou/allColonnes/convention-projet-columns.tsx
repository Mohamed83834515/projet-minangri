import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { buildEditDeleteActionsColumn } from '@/Global/Tableaux/buildEditDeleteActionsColumn'
import type { Acteur } from '@/simadou/allTypes/acteur'
import type { Convention } from '@/simadou/allTypes/convention'
import { resolveBailleurLabel } from '@/simadou/lib/financementProjetUtils'
import { formatNumber } from '@/simadou/allSercices/montantFormater'

function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('fr-FR')
}

export function buildConventionProjetColumns({
  signatairesById,
  onEdit,
  onDeleteRequest,
}: {
  signatairesById: Map<number, Acteur>
  onEdit: (row: Convention) => void
  onDeleteRequest: (row: Convention) => void
}): ColumnDef<Convention>[] {
  return [
    {
      id: 'code_convention',
      accessorKey: 'code_convention',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Code' />
      ),
      cell: ({ row }) => (
        <div className='font-medium'>{row.original.code_convention}</div>
      ),
    },
    {
      id: 'intutile_conv',
      accessorKey: 'intutile_conv',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Intitulé' />
      ),
      cell: ({ row }) => <div>{row.original.intutile_conv}</div>,
    },
    {
      id: 'reference_conv',
      accessorKey: 'reference_conv',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Référence' />
      ),
      cell: ({ row }) => <div>{row.original.reference_conv}</div>,
    },
    {
      id: 'montant_conv',
      accessorKey: 'montant_conv',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title='Montant'
          className='justify-center'
        />
      ),
      cell: ({ row }) => (
        <div className='w-full text-center font-mono tabular-nums'>
          {formatNumber(row.original.montant_conv)} GNF
        </div>
      ),
      meta: { thClassName: 'text-center', className: 'text-center' },
    },
    {
      id: 'date_signature_conv',
      accessorKey: 'date_signature_conv',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Date signature' />
      ),
      cell: ({ row }) => (
        <div>{formatDate(row.original.date_signature_conv)}</div>
      ),
    },
    {
      id: 'partenaire_conv',
      accessorKey: 'partenaire_conv',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Partenaire financier' />
      ),
      cell: ({ row }) =>
        resolveBailleurLabel(row.original.partenaire_conv, signatairesById),
    },
    buildEditDeleteActionsColumn<Convention>({
      onEdit,
      onDeleteRequest,
    }),
  ]
}
