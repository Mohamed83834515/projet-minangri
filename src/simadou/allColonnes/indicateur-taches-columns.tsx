import { Row, type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { cn } from '@/lib/utils'
import { GenericRowActions } from '@/Global/Tableaux/GenericRowActions'
import { Trash2, UserPen } from 'lucide-react'
import { IndicateurTache } from '../allTypes/indicateurTache'

export type IndicateurTacheTableRow = IndicateurTache

const colWide = 'max-w-[220px] whitespace-normal'

type IndicateurTacheDialogType =  'delete'
type IndicateurTacheRowActionsProps = {
    row: Row<IndicateurTache>
    setOpen: (dialog: IndicateurTacheDialogType | null) => void
    onEdit: (row_tache: IndicateurTache) => void
    setCurrentRow: React.Dispatch<React.SetStateAction<IndicateurTache | null>>
}
function IndicateurTacheRowActions({
    row,
    onEdit,
    setOpen,
    setCurrentRow,
}: IndicateurTacheRowActionsProps) {
    return (
        <GenericRowActions
            row={row}
            actions={[
                {
                    label: 'Modifier',
                    icon: <UserPen size={16} />,
                    onClick: onEdit,
                },
                {
                    label: 'Supprimer',
                    icon: <Trash2 size={16} />,
                    onClick: (tache: IndicateurTache) => {
                        setCurrentRow(tache)
                        setOpen('delete')
                    },
                    className: 'text-red-500!',
                    separator: true,
                },
            ]}
        />
    )
}

export function buildIndicateurTacheColumns(
    setOpen: (dialog: IndicateurTacheDialogType | null) => void,
    setCurrentRow: React.Dispatch<React.SetStateAction<IndicateurTache | null>>,
    onEdit: (tache: IndicateurTache) => void
): ColumnDef<IndicateurTache>[] {
    const intitule: ColumnDef<IndicateurTache> = {
        id: 'intitule_indicateur_tache',
        accessorKey: 'intitule_indicateur_tache',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Intitulé indicateur' />
        ),
        cell: ({ row }) => {
            const indicateur = row.original
            return (
                <div className={cn('flex items-start gap-2.5', colWide)}>
                    <span className='mt-0.5 shrink-0 text-sm font-semibold text-muted-foreground'>
                        {row.index + 1}.
                    </span>
                    <div className='min-w-0 space-y-0.5'>
                        <p className='font-medium leading-snug'>{indicateur.intitule_indicateur_tache}</p>
                    </div>
                </div>
            )
        },
        meta: { thClassName: 'ps-4', className: 'ps-4' },
        enableSorting: false,
        enableHiding: false,
    }

    const unite: ColumnDef<IndicateurTache> = {
        id: 'unite_ind_tache',
        accessorKey: 'unite_ind_tache',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Unité' />
        ),
        cell: ({ row }) => (
            <span className='tabular-nums'>{row.original.unite_ind_tache}</span>
        ),
        meta: { thClassName: 'text-center', className: 'text-center' },
        enableSorting: false,
        enableHiding: false,
    }

    const trimestre1: ColumnDef<IndicateurTache> = {
        id: 'trimestre_1',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Trimestre 1' />
        ),
        cell: ({ row }) => {
            const raw = row.original.trimestre_1
            if (!raw) {
                return <span className='text-muted-foreground'>—</span>
            }
            return <span className='font-semibold tabular-nums'>{raw}</span>
        },
        meta: { thClassName: 'text-center', className: 'text-center' },
        enableSorting: false,
        enableHiding: false,
    }
    const trimestre2: ColumnDef<IndicateurTache> = {
        id: 'trimestre_2',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Trimestre 2' />
        ),
        cell: ({ row }) => {
            const raw = row.original.trimestre_2
            if (!raw) {
                return <span className='text-muted-foreground'>—</span>
            }
            return <span className='font-semibold tabular-nums'>{raw}</span>
        },
        meta: { thClassName: 'text-center', className: 'text-center' },
        enableSorting: false,
        enableHiding: false,
    }
    const trimestre3: ColumnDef<IndicateurTache> = {
        id: 'trimestre_3',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Trimestre 3' />
        ),
        cell: ({ row }) => {
            const raw = row.original.trimestre_3
            if (!raw) {
                return <span className='text-muted-foreground'>—</span>
            }
            
            return <span className='font-semibold tabular-nums'>{raw}</span>
        },
        meta: { thClassName: 'text-center', className: 'text-center' },
        enableSorting: false,
        enableHiding: false,
    }
    const trimestre4: ColumnDef<IndicateurTache> = {
        id: 'trimestre_4',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Trimestre 4' />
        ),
        cell: ({ row }) => {
            const raw = row.original.trimestre_4
            if (!raw) {
                return <span className='text-muted-foreground'>—</span>
            }
            return <span className='font-semibold tabular-nums'>{raw}</span>
        },
        meta: { thClassName: 'text-center', className: 'text-center' },
        enableSorting: false,
        enableHiding: false,
    }


    const ActionColumn: ColumnDef<IndicateurTache> = {
        id: 'actions',
        accessorKey: 'id_groupe_tache',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Actions' />
        ),
        cell: (props) => (
            <IndicateurTacheRowActions
                {...props}
                onEdit={onEdit}
                setOpen={setOpen}
                setCurrentRow={setCurrentRow || null}
            />
        ),
        enableSorting: false,
        enableHiding: false,
        meta: { thClassName: 'text-center', className: 'text-center' },
    }

    return [
        intitule,
        unite,
        trimestre1,
        trimestre2,
        trimestre3,
        trimestre4,
        ActionColumn,
    ]
}
