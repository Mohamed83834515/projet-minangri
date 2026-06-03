// simadou/allfonctionalities/parametrage/categorie-acteur/ListeCategorieActeur.tsx
import { useCallback, useMemo, useState } from "react"
import { useDeleteCategorieActeur, useGetCategoriesActeur } from "@/simadou/allHooks/admin/categorieActeurHooks"
import useDialogState from "@/hooks/use-dialog-state"
import { GenericTable } from "@/Global/Generic/Generictable"
import { GenericDialogs } from "@/Global/Generic/Genericdialogs"
import { GenericDeleteDialog } from "@/Global/Tableaux/GenericDeleteDialog"
import { CategorieActeur } from "@/simadou/allTypes/categorieActeur"
import { useEmbeddedTableState } from "@/hooks/use-embedded-table-state"
import { DataTableToolbarOutlineButton } from "@/components/data-table/toolbar-outline-button"
import { buildCategorieActeurColumns } from "@/simadou/allColonnes/categorie-acteur-columns"

export default function ListeCategorieActeur({
  onAdd,
  onEdit,
}: {
  onAdd: () => void
  onEdit: (row: CategorieActeur) => void
}) {
  const { data = [] } = useGetCategoriesActeur()
  const [open, setOpen] = useDialogState<"add" | "edit" | "delete">(null)
  const [currentRow, setCurrentRow] = useState<CategorieActeur | null>(null)

  const { search, navigate } = useEmbeddedTableState()
  const deleteMutation = useDeleteCategorieActeur()

  const handleEdit = useCallback((row: CategorieActeur) => {
    setCurrentRow(row)
    onEdit(row)
  }, [onEdit])

  const columns = useMemo(
    () => buildCategorieActeurColumns(setOpen, setCurrentRow, handleEdit),
    [handleEdit]
  )

  const handleCloseDialogs = useCallback(() => {
    setOpen(null)
    setCurrentRow(null)
  }, [setOpen])

  return (
    <>
      <GenericTable
        data={data}
        columns={columns}
        search={search}
        showSearch={false}
        showPagination={false}
        navigate={navigate}
        showViewOptions={false}
        toolbarEndSlot={
          <DataTableToolbarOutlineButton
            className='ms-auto'
            onClick={onAdd}
          >
            Ajouter
          </DataTableToolbarOutlineButton>
        }
      />

      <GenericDialogs
        open={open}
        setOpen={setOpen}
        currentRow={currentRow}
        setCurrentRow={setCurrentRow}
        rowRequiredDialogs={["edit", "delete"]}
        dialogMap={{
          delete: (props) => (
            <GenericDeleteDialog
              {...props}
              entityName="catégorie d'acteur"
              currentRow={props.currentRow as CategorieActeur}
              getEntityLabel={(row: CategorieActeur) => `${row.code_cat} - ${row.nom_categorie}`}
              onDelete={(row) => {
                deleteMutation.mutate(row?.id_categorie || 0)
                handleCloseDialogs()
              }}
            />
          ),
        }}
      />
    </>
  )
}