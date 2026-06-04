// simadou/components/suivi/IndicateurTacheList.tsx
import { useMemo, useState } from 'react'
import { GenericTable } from '@/Global/Generic/Generictable'
import { useEmbeddedTableState } from '@/hooks/use-embedded-table-state'
import useDialogState from '@/hooks/use-dialog-state'
import { useDeleteSuiviIndicateur } from '@/simadou/allHooks/admin/indicateurTacheHooks'
import { toast } from 'sonner'
import { GenericDeleteDialog } from '@/Global/Tableaux/GenericDeleteDialog'
// import { Button } from '@/components/ui/button'
import { IndicateurTache } from '@/simadou/allTypes/indicateurTache'
import { buildIndicateurTacheColumns } from '@/simadou/allColonnes/indicateur-taches-columns'
import { DataTableToolbarOutlineButton } from '@/components/data-table/toolbar-outline-button'

type IndicateurTacheListProps = {
  indicateurs: IndicateurTache[]
  idActivite: number
  onEdit: (indicateur: IndicateurTache) => void
  onAdd: () => void
}

export default function IndicateurTacheList({
  indicateurs,
  idActivite,
  onEdit,
  onAdd
}: IndicateurTacheListProps) {
  const { search, navigate } = useEmbeddedTableState()
  const [open, setOpen] = useDialogState<'delete'>(null)
  const [currentRow, setCurrentRow] = useState<IndicateurTache | null>(null)

  const columns = useMemo(
    () => buildIndicateurTacheColumns(setOpen, setCurrentRow, onEdit),
    [onEdit, setOpen, setCurrentRow]
  )

  const deleteMutation = useDeleteSuiviIndicateur(idActivite)

  const handleConfirmDelete = (row: IndicateurTache) => {
    deleteMutation.mutate(row.id_indicateur_tache, {
      onSuccess: () => {
        toast.success('Indicateur supprimé avec succès')
        setOpen(null)
        setCurrentRow(null)
      },
      onError: () => toast.error('Erreur lors de la suppression'),
    })
  }

  return (
    <>
      <div className="space-y-4">
        {/* <div className="flex justify-end">
          <Button onClick={onAdd} variant="outline">
            Ajouter un indicateur
          </Button>
        </div> */}

        <GenericTable<IndicateurTache>
          data={indicateurs}
          columns={columns}
          search={search}
          navigate={navigate}
          searchKey='intitule_indicateur_tache'
          searchPlaceholder='Filtrer les indicateurs...'
          urlFilterConfig={[
            {
              columnId: 'intitule_indicateur_tache',
              searchKey: 'intitule_indicateur_tache',
              type: 'string',
            },
          ]}
          toolbarEndSlot={
            <DataTableToolbarOutlineButton
              className='ms-auto'
              onClick={onAdd}
            >
              Ajouter
            </DataTableToolbarOutlineButton>
          }
          defaultPageSize={10}
          showViewOptions={false}
          showPagination={false}
          showSearch={false}
          emptyMessage='Aucun indicateur défini pour cette activité.'
        />
      </div>

      {currentRow && (
        <GenericDeleteDialog<IndicateurTache>
          open={open === 'delete'}
          onOpenChange={(isOpen) => setOpen(isOpen ? 'delete' : null)}
          currentRow={currentRow}
          entityName="indicateur d'activité"
          getEntityLabel={(row) => row.intitule_indicateur_tache}
          onDelete={handleConfirmDelete}
        />
      )}
    </>
  )
}