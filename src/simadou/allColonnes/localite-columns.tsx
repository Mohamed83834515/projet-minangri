// simadou/allColonnes/localite-columns.tsx
import { buildColumns } from "@/Global/Tableaux/column-builder"

export const buildLocaliteColumns = (
  niveaux: any[],
  currentNiveauNombre: number
) => {
  // Récupérer les niveaux parents (avec nombre inférieur)
  const parentNiveaux = niveaux
    .filter((n: any) => n.nombre_nlc < currentNiveauNombre)
    .sort((a: any, b: any) => b.nombre_nlc - a.nombre_nlc)

  // Fonction pour récupérer la hiérarchie parente
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

  // Colonnes pour les parents
  const parentColumns = parentNiveaux.map((parent: any) => ({
    id: `parent_${parent.id_nlc}`,
    accessorKey: `parent_${parent.id_nlc}`,
    header: parent.libelle_nlc,
    cell: ({ row }: any) => {
      const hierarchy = getParentHierarchy(row.original)
      const parentIndex = parentNiveaux.findIndex((p: any) => p.id_nlc === parent.id_nlc)
      return hierarchy[parentIndex]?.intitule_loca || '-'
    },
  }))

  return [...baseColumns, ...parentColumns]
}