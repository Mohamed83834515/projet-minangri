// simadou/allColonnes/zoneCollecte-columns.tsx
import { GenericRowActions } from "@/Global/Tableaux/GenericRowActions"
import { UserPen, Trash2 } from "lucide-react"
import { ZoneCollecte } from "../allTypes"
import { DataTableColumnHeader } from "@/components/data-table/column-header"
import { ColumnDef } from "@tanstack/react-table"

type ZoneCollecteDialogType = 'add' | 'edit' | 'delete'

export const buildZoneCollecteColumns = (
    setOpen: (dialog: ZoneCollecteDialogType | null) => void,
    setCurrentRow: React.Dispatch<React.SetStateAction<ZoneCollecte | null>>
): ColumnDef<ZoneCollecte>[] => {
    return [
        {
            id: 'code_zone',
            accessorKey: 'code_zone',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title='Code' />
            ),
            cell: ({ row }) => (
                <div className='font-medium'>{row.original.code_zone}</div>
            ),
        },
        {
            id: 'nom_zone',
            accessorKey: 'nom_zone',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title='Nom ' />
            ),
            cell: ({ row }) => (
                <div className='font-medium'>{row.original.nom_zone}</div>
            ),
        },
        {
            id: 'type_zone',
            accessorKey: 'type_zone',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title='Type de zone' />
            ),
            cell: ({ row }) => (
                <div className='max-w-md whitespace-normal'>{row.original.type_zone}</div>
            ),
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
                            onClick: () => {
                                setCurrentRow(row.original)
                                setOpen('edit')
                            },
                        },
                        {
                            label: 'Supprimer',
                            icon: <Trash2 size={16} />,
                            onClick: () => {
                                setCurrentRow(row.original)
                                setOpen('delete')
                            },
                            className: 'text-red-500!',
                            separator: true,
                        },
                    ]}
                />
            ),
        },
    ]
}