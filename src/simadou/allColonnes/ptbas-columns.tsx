import { type Row } from '@tanstack/react-table'
import { GenericRowActions } from '@/Global/Tableaux/GenericRowActions'
import { buildColumns, type OptionItem } from '@/Global/Tableaux/column-builder'
import { UserPen, Trash2, CheckCircle, MinusCircle } from 'lucide-react'
import { Ptba } from '../allTypes'
import { getMoisOptions } from '../schemas/ptbaSchemas'

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
                    label: 'Edit',
                    icon: <UserPen size={16} />,
                    onClick: (ptba) => {
                        setCurrentRow(ptba)
                        setOpen('edit')
                    },
                },
                {
                    label: 'Delete',
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

// Fonction pour vérifier si un mois est dans le chronogramme
const isMonthInChronogramme = (chronogramme: string, monthCode: string): boolean => {
    if (!chronogramme) return false
    const months = chronogramme.split(',').map(m => m.trim())
    return months.includes(monthCode)
}

// Personnaliser le rendu des colonnes mois
const getMonthColumn = (mois: { value: string; label: string }, chronogramme?: string) => {
    const isActive = chronogramme ? isMonthInChronogramme(chronogramme, mois.value) : false

    return {
        type: 'text' as const,
        key: mois.value,
        title: mois.label,
        cell: (row: Ptba) => {
            const isIncluded = isMonthInChronogramme(row.chronogramme || '', mois.value)
            return (
                <div className="flex justify-center">
                    {isIncluded ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                        <MinusCircle className="h-5 w-5 text-gray-300" />
                    )}
                </div>
            )
        },
    }
}


export const buildPtbasColumns = (
    setOpen: (dialog: PtbasDialogType | null) => void,
    setCurrentRow: React.Dispatch<React.SetStateAction<Ptba | null>>
) =>
    buildColumns<Ptba>([
        { type: 'text', key: 'code_activite_ptba', title: 'Code Ptba', sticky: true },
        { type: 'text', key: 'intitule_activite_ptba', title: 'Intitulé Activité' },
        { type: 'text', key: 'responsable_ptba', title: 'Responsable Ptba' },
        { type: 'text', key: 'version_ptba', title: 'Version' },
        { type: 'text', key: 'id_ptba', title: 'Planification' },
        ...getMoisOptions().map((mois) => ({
            type: 'text' as const,
            key: mois.value,
            title: mois.label,
            cell: ({ row }: any) => {
                const chronogramme = row.chronogramme || ""

                const isActive = chronogramme
                    .split(', ')
                    .map((m: string) => m.trim())
                    .includes(mois.value)

                return (
                    <div
                        className={
                            isActive
                                ? "bg-green-100 text-green-700 px-2 py-1 rounded-md font-medium"
                                : "bg-gray-100 text-gray-400 px-2 py-1 rounded-md"
                        }
                    >
                        {isActive ? "✔" : "-"} 
                    </div>
                )
            },
        })),
        { type: 'text', key: 'cout', title: 'Coût ($)' },
        {
            type: 'actions',
            cell: (props) => (
                <PtbasRowActions
                    {...props}
                    setOpen={setOpen}
                    setCurrentRow={setCurrentRow}
                />
            ),
        },
    ])

