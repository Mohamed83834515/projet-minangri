import { ColumnDef, type Row } from '@tanstack/react-table'
import { GenericRowActions } from '@/Global/Tableaux/GenericRowActions'
import { buildColumns, type OptionItem } from '@/Global/Tableaux/column-builder'
import { UserPen, Trash2, CheckCircle, MinusCircle, ClipboardList } from 'lucide-react'
import { Ptba } from '../allTypes'
import { getMoisOptions } from '../schemas/ptbaSchemas'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { Button } from '@/components/ui/button'

type PtbasDialogType = 'edit' | 'delete'

type PtbasRowActionsProps = {
    row: Row<Ptba>
    setOpen: (dialog: PtbasDialogType | null) => void
    setCurrentRow: React.Dispatch<React.SetStateAction<Ptba | null>>
}

function PtbasRowActions({
    row,
    setOpen,
    setCurrentRow,
}: PtbasRowActionsProps) {
    return (
        <GenericRowActions
            row={row}
            actions={[
                {
                    label: 'Modifier',
                    icon: <UserPen size={16} />,
                    onClick: (ptba) => {
                        setCurrentRow(ptba)
                        setOpen('edit')
                    },
                },
                {
                    label: 'Supprimer',
                    icon: <Trash2 size={16} />,
                    onClick: (ptba) => {
                        setCurrentRow(ptba)
                        setOpen('delete')
                    },
                    className: 'text-red-500!',
                    separator: true,
                },
            ]}
        />
    )
}

type Props = {
    value: string | string[] | null | undefined
    month: string
}

export function ChronogrammeMonthCell({ value, month }: Props) {
    const months = parseChronogramme(value)

    const isActive = months.includes(month)
    return (
        <div className="flex justify-center">
            {isActive ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
                <MinusCircle className="h-5 w-5 text-gray-300" />
            )}
        </div>
    )
}
// Personnaliser le rendu des colonnes mois
export const parseChronogramme = (value: unknown): string[] => {
    if (!value) return []

    if (Array.isArray(value)) {
        return value.map(v => String(v).trim()).filter(Boolean)
    }

    if (typeof value !== 'string') return []

    return value
        .split(',')
        .map(v => v.trim())
        .filter(v => v.length > 0)
}

export const buildPtbasColumns = (
    setOpen: (dialog: PtbasDialogType | null) => void,
    setCurrentRow: React.Dispatch<React.SetStateAction<Ptba | null>>,
    onOpenPlanification: (activite: Ptba) => void
) => {
    const baseColumns = buildColumns<Ptba>([
        { type: "text", key: "code_activite_ptba", title: "Code", sticky: true },
        { type: "text", key: "intitule_activite_ptba", title: "Activité" },
        { type: "text", key: "responsable_ptba", title: "Responsable" },
    ])

    const actionsColumn: ColumnDef<Ptba> = {
        id: "actions",
        accessorKey: 'id_ptba',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Actions' />
        ),
        cell: (props) => (
            <PtbasRowActions
                {...props}
                setOpen={setOpen}
                setCurrentRow={setCurrentRow}
            />
        ),
        enableSorting: false,
        enableHiding: false,
    }

    const chronogrammeColumns: ColumnDef<Ptba>[] = getMoisOptions().map((mois) => ({
        id: `chronogramme_${mois.value}`,
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={mois.label}
                className="text-center"
            />
        ),
        cell: ({ row }) => (
            <ChronogrammeMonthCell
                value={row.original?.chronogramme}
                month={mois.value}
            />
        ),
        meta: {
            className: "text-center",
        },
        enableSorting: false,
        enableHiding: false,
    }))


    const coutColumns: ColumnDef<Ptba> = {
        id: 'cout_row',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Coût' />
        ),
        cell: ({ row }) => (
            <span className='tabular-nums'>300 000</span>
        ),
        meta: { thClassName: 'text-center', className: 'text-center' },
        enableSorting: false,
        enableHiding: false,
    }

    const planificationColumn: ColumnDef<Ptba> = {
        id: 'planification`',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Planification'
                className='w-full text-center'
            />
        ),
        cell: ({ row }) => {
            const activite = row.original
            return (
                <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='mx-auto flex h-8 w-8 shrink-0 text-primary'
                    onClick={() => onOpenPlanification(activite)}
                    aria-label='Ouvrir le suivi des tâches et indicateurs'
                    title='Suivi des tâches et indicateurs'
                >
                    <ClipboardList className='h-5 w-5' /> Planifier
                </Button>
            )
        },
        meta: {
            thClassName: 'text-center w-[72px]',
            className: 'text-center align-middle',
        },
        size: 72,
        enableSorting: false,
        enableHiding: false,
    }

    return [
        ...baseColumns,
        ...chronogrammeColumns,
        planificationColumn,
        coutColumns,
        actionsColumn,
    ]
}