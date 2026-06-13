import { ColumnDef, type Row } from '@tanstack/react-table'
import { GenericRowActions } from '@/Global/Tableaux/GenericRowActions'
import { buildColumns } from '@/Global/Tableaux/column-builder'
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
    const responsableColumn: ColumnDef<Ptba> = {
        id: "responsable_ptba",
        accessorKey: 'responsable_ptba',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Responsable' />
        ),
        cell: ({ row }) => {
            const responsable = row.original.responsable_ptba;

            let nomComplet = "-";
            if (responsable && typeof responsable === "object") {
                const prenom = responsable.prenom_perso || "";
                const nom = responsable.nom_perso || "";
                nomComplet = `${prenom} ${nom}`.trim() || "-";
            }

            return (
                <div className='flex justify-center'>
                    {nomComplet !== "-" ? (
                        <span className='inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'>
                            {nomComplet}
                        </span>
                    ) : (
                        <span className='text-sm text-muted-foreground'>-</span>
                    )}
                </div>
            )
        },
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
            <DataTableColumnHeader column={column} title='Coût (GNF)' />
        ),
        cell: ({ row }) => {
            // Générer un coût aléatoire entre 1 000 000 et 3 000 000 GNF
            // Basé sur l'ID de la ligne pour rester cohérent (éviter les changements à chaque rendu)
            const id = row.original.id_ptba || row.index || Math.random()
            const minCout = 1_000_000
            const maxCout = 3_000_000
            const cout = minCout + (Math.abs(Number(id) * 12345) % (maxCout - minCout))

            return (
                <div className='flex justify-center'>
                    <span className='inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold tabular-nums text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'>
                        {new Intl.NumberFormat('fr-FR').format(cout)} 
                    </span>
                </div>
            )
        },
        meta: { thClassName: 'text-center', className: 'text-center' },
        enableSorting: true,
        sortDescFirst: true,
        enableHiding: false,
    }

    const planificationColumn: ColumnDef<Ptba> = {
        id: 'planification',
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
                <div className='flex justify-center'>
                    <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        className='gap-2 border-blue-200 bg-blue-50 text-blue-700 transition-all duration-200 hover:bg-blue-100 hover:text-blue-800 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-950/50'
                        onClick={() => onOpenPlanification(activite)}
                        aria-label='Ouvrir le suivi des tâches et indicateurs'
                        title='Suivi des tâches et indicateurs'
                    >
                        <ClipboardList className='h-4 w-4' />
                        <span className='text-xs font-medium'>Planifier</span>
                    </Button>
                </div>
            )
        },
        meta: {
            thClassName: 'text-center w-[100px]',
            className: 'text-center align-middle',
        },
        size: 100,
        enableSorting: false,
        enableHiding: false,
    }

    return [
        ...baseColumns,
        responsableColumn,
        ...chronogrammeColumns,
        planificationColumn,
        coutColumns,
        actionsColumn,
    ]
}