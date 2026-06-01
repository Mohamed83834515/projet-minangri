import { buildColumns } from "@/Global/Tableaux/column-builder"
import { GenericRowActions } from "@/Global/Tableaux/GenericRowActions"

import {
  UserPen,
  Trash2,
} from "lucide-react"

export const buildTypeActiviteColumns = (
  setOpen: any,
  setCurrentRow: any,
  onEdit: (row: any) => void
) => [

  ...buildColumns([
    {
      type: "text",
      key: "code_type",
      title: "Code",
    },

    {
      type: "text",
      key: "intutile_type",
      title: "Intitulé",
    },

    {
      type: "text",
      key: "description",
      title: "Description",
      maxWidth: "max-w-md",
    },
  ]),

  {
    id: "actions",

    cell: ({ row }: any) => (
      <GenericRowActions
        row={row}
        actions={[
          {
            label: "Modifier",
            icon: <UserPen size={16} />,
            onClick: (item) => {
              setCurrentRow(item)
              onEdit(item)
            },
          },

          {
            label: "Supprimer",
            icon: <Trash2 size={16} />,
            className: "text-red-500!",
            separator: true,

            onClick: (item) => {
              setCurrentRow(item)
              setOpen("delete")
            },
          },
        ]}
      />
    ),
  },
]