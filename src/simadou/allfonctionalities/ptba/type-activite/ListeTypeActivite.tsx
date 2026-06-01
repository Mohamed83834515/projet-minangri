import { useCallback, useMemo, useState } from "react";
import { useDeleteTypeActivite, useGetTypeActivites } from "@/simadou/allHooks/admin/typeActivitesHooks";
import useDialogState from "@/hooks/use-dialog-state";
import { buildTypeActiviteColumns } from "@/simadou/allColonnes/typeActivites-columns";
import { GenericTable } from "@/Global/Generic/Generictable";
import { GenericDialogs } from "@/Global/Generic/Genericdialogs";
import { GenericDeleteDialog } from "@/Global/Tableaux/GenericDeleteDialog";
import { TypeActivite } from "@/simadou/allTypes/entities";
import { Button } from "@/components/ui/button";
import { useEmbeddedTableState } from "@/hooks/use-embedded-table-state";

export default function ListeTypeActivite({
  onAdd,
  onEdit,
}: {
  onAdd: () => void
  onEdit: (row: TypeActivite) => void
}) {
  const { data = [] } = useGetTypeActivites()
  const [open, setOpen] = useDialogState<"add" | "edit" | "delete">(null)
  const [currentRow, setCurrentRow] = useState<TypeActivite | null>(null)

  const { search, navigate } = useEmbeddedTableState()
  const deleteMutation = useDeleteTypeActivite()
  // ✅ CORRECTION : Mémoriser les handlers pour éviter les re-rendus
  const handleEdit = useCallback((row: TypeActivite) => {
    setCurrentRow(row)
    onEdit(row)
  }, [onEdit])

  const columns = useMemo(
    () => buildTypeActiviteColumns(setOpen, setCurrentRow, handleEdit),
    [handleEdit] // ✅ Dépendance corrigée
  )

  // ✅ CORRECTION : Gérer la fermeture propre
  const handleCloseDialogs = useCallback(() => {
    setOpen(null)
    setCurrentRow(null)
  }, [setOpen])

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={onAdd} variant="outline">
            Ajouter un type
          </Button>
        </div>

        <GenericTable
          data={data}
          columns={columns}
          search={search}
          showSearch={false}
          showPagination={false}
          navigate={navigate}
          showViewOptions={false}
        />
      </div>

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
              entityName="type d'activité"
              currentRow={props.currentRow}
              getEntityLabel={(row: any) => row.intutile_type}
              onDelete={(row) => {
                deleteMutation.mutate(row?.id_type || 0)
                handleCloseDialogs()
              }}
            />
          ),
        }}
      />
    </>
  )
}