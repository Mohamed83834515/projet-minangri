import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { GenericRowActions } from '@/Global/Tableaux/GenericRowActions'
import type { Convention } from '@/simadou/allTypes/convention'
import { Trash2, UserPen } from 'lucide-react'
import { formatNumber } from '../allSercices/montantFormater'

type ConventionDialogType = 'add' | 'edit' | 'delete'
export const buildConventionColumns = (
  setOpen: (dialog: ConventionDialogType | null) => void,
  setCurrentRow: React.Dispatch<React.SetStateAction<Convention | null>>
): ColumnDef<Convention>[] => [
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
      <DataTableColumnHeader column={column} title='Montant' className='justify-center' />
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
      <div>
        {new Date(row.original.date_signature_conv).toLocaleDateString('fr-FR')}
      </div>
    ),
  },
  {
    id: 'partenaire_conv',
    accessorKey: 'partenaire_conv',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Partenaire' />
    ),
    cell: ({ row }) => {
      const partenaire = row.original.partenaire_conv
      if (!partenaire?.nom_acteur) {
        return <span className='text-muted-foreground'>—</span>
      }
      return (
        <span>
          {partenaire.nom_acteur}
          {partenaire.code_acteur ? ` (${partenaire.code_acteur})` : ''}
        </span>
      )
    },
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Actions' />
    ),
    cell: ({ row }) => (
      <GenericRowActions
        row={row}
        actions={[
          {
            label: 'Modifier',
            icon: <UserPen size={16} />,
            onClick: (item) => {
              setCurrentRow(item)
              setOpen('edit')
            },
          },
          {
            label: 'Supprimer',
            icon: <Trash2 size={16} />,
            className: 'text-red-500!',
            separator: true,
            onClick: (item) => {
              setCurrentRow(item)
              setOpen('delete')
            },
          },
        ]}
      />
    ),
  },
]
