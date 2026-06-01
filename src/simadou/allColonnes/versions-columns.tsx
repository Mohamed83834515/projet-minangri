import type { ColumnDef } from "@tanstack/react-table"
import {
  Archive,
  CheckCircle,
  Trash2,
  UserPen,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buildColumns } from "@/Global/Tableaux/column-builder"
import { GenericRowActions } from "@/Global/Tableaux/GenericRowActions"
import { VersionPtba } from "../allTypes"


type BuildVersionPtbaColumnsProps = {
  setOpen: (value: "delete" | null) => void
  setCurrentRow: (row: VersionPtba | null) => void

  onEdit: (row: VersionPtba) => void
  onValidate: (row: VersionPtba) => void
  onArchive: (row: VersionPtba) => void
}

export function buildVersionPtbaColumns({
  setOpen,
  setCurrentRow,
  onEdit,
  onValidate,
  onArchive,
}: BuildVersionPtbaColumnsProps): ColumnDef<VersionPtba>[] {
  const baseColumns = buildColumns<VersionPtba>([
    {
      type: "text",
      key: "version_ptba",
      title: "Version",
      sticky: true,
    },

    {
      type: "text",
      key: "annee_ptba",
      title: "Année",
    },

    {
      type: "text",
      key: "date_validation",
      title: "Date validation",
    },

    {
      type: "text",
      key: "observation",
      title: "Observation",
      maxWidth: "max-w-md",
    },
  ])

  const actionsColumn: ColumnDef<VersionPtba> = {
    id: "actions",

    cell: ({ row }) => {
      const item = row.original

      return (
        <GenericRowActions
          row={row}
          actions={[
            {
              label: "Modifier",
              icon: <UserPen size={16} />,

              onClick: () => {
                onEdit(item)
              },
            },

            ...(item.statut_version === 0
              ? [
                  {
                    label: "Valider",
                    icon: <CheckCircle size={16} />,
                    className: "text-green-600!",

                    onClick: () => {
                      onValidate(item)
                    },
                  },
                ]
              : []),

            ...(item.statut_version === 1
              ? [
                  {
                    label: "Archiver",
                    icon: <Archive size={16} />,
                    className: "text-orange-600!",

                    onClick: () => {
                      onArchive(item)
                    },
                  },
                ]
              : []),

            {
              label: "Supprimer",
              icon: <Trash2 size={16} />,
              className: "text-red-500!",
              separator: true,

              onClick: () => {
                setCurrentRow(item)
                setOpen("delete")
              },
            },
          ]}
        />
      )
    },
  }

  return [...baseColumns, actionsColumn]
}