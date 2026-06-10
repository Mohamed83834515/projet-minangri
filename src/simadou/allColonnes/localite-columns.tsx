// simadou/allColonnes/localite-columns.tsx
import { buildColumns } from "@/Global/Tableaux/column-builder"
<<<<<<< HEAD

export const buildLocaliteColumns = (
  niveaux: any[],
  currentNiveauNombre: number
) => {
  // Récupérer les niveaux parents (avec nombre inférieur)
=======
import { GenericRowActions } from "@/Global/Tableaux/GenericRowActions"
import { UserPen, Trash2 } from "lucide-react"

export const buildLocaliteColumns = (
  niveaux: any[],
  currentNiveauNombre: number,
  onEdit: (row: any) => void,
  onDeleteRequest: (row: any) => void
) => {
>>>>>>> develop
  const parentNiveaux = niveaux
    .filter((n: any) => n.nombre_nlc < currentNiveauNombre)
    .sort((a: any, b: any) => b.nombre_nlc - a.nombre_nlc)

<<<<<<< HEAD
  // Fonction pour récupérer la hiérarchie parente
=======
>>>>>>> develop
  const getParentHierarchy = (row: any) => {
    const hierarchy: any[] = []
    let currentParent = row.parent_loca
    while (currentParent && typeof currentParent === 'object') {
      hierarchy.push(currentParent)
      currentParent = currentParent.parent_loca
    }
    return hierarchy
  }

  const baseColumns = buildColumns([
    {
      type: "text",
      key: "code_national_loca",
      title: "Code",
    },
    {
      type: "text",
      key: "intitule_loca",
      title: "Libellé",
    },
  ])

<<<<<<< HEAD
  // Colonnes pour les parents
  const parentColumns = parentNiveaux.map((parent: any) => ({
    id: `parent_${parent.id_nlc}`,
    accessorKey: `parent_${parent.id_nlc}`,
=======
  const parentColumns = parentNiveaux.map((parent: any) => ({
    id: `parent_${parent.id_nlc}`,
>>>>>>> develop
    header: parent.libelle_nlc,
    cell: ({ row }: any) => {
      const hierarchy = getParentHierarchy(row.original)
      const parentIndex = parentNiveaux.findIndex((p: any) => p.id_nlc === parent.id_nlc)
      return hierarchy[parentIndex]?.intitule_loca || '-'
    },
  }))

<<<<<<< HEAD
  return [...baseColumns, ...parentColumns]
=======
  const actionColumn = {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => (
      <GenericRowActions
        row={row}
        actions={[
          {
            label: "Modifier",
            icon: <UserPen size={16} />,
            onClick: () => onEdit(row.original),
          },
          {
            label: "Supprimer",
            icon: <Trash2 size={16} />,
            className: "text-red-500!",
            separator: true,
            onClick: () => onDeleteRequest(row.original),
          },
        ]}
      />
    ),
  }

  return [...baseColumns, ...parentColumns, actionColumn]
>>>>>>> develop
}