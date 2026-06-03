import { useCallback, useMemo, useState } from 'react'
import { Target } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DataTableToolbarOutlineButton } from '@/components/data-table/toolbar-outline-button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { GenericTable } from '@/Global/Generic/Generictable'
import { GenericDeleteDialog } from '@/Global/Tableaux/GenericDeleteDialog'
import useDialogState from '@/hooks/use-dialog-state'
import { useEmbeddedTableState } from '@/hooks/use-embedded-table-state'
import type { IndicateurCmr } from '@/simadou/allTypes'
import { buildIndicateurCmrColumns } from '@/simadou/allColonnes/indicateur-cmr-columns'
import {
  useDeleteIndicateurCmr,
  useGetIndicateursCmr,
} from '@/simadou/allHooks/admin/indicateurCmrHooks'
import IndicateurCmrDetailView from '@/simadou/allfonctionalities/projets/detail/cmrIndicators/IndicateurCmrDetailView'
import CiblesCmrDialog from './CiblesCmrDialog'
import IndicateurCmrFormPanel from './IndicateurCmrFormPanel'

type ModalState = 'indicateur' | 'indicateurView'

export default function ListeIndicateursCmr() {
  const { data: indicateurs = [], dataUpdatedAt } = useGetIndicateursCmr()
  const deleteMutation = useDeleteIndicateurCmr()
  const { search, navigate } = useEmbeddedTableState()

  const [modal, setModal] = useState<ModalState | null>(null)
  const [ciblesOpen, setCiblesOpen] = useState(false)
  const [selectedIndicateurId, setSelectedIndicateurId] = useState<number | null>(
    null
  )
  const [selectedIndicateur, setSelectedIndicateur] = useState<IndicateurCmr | null>(
    null
  )

  const [deleteOpen, setDeleteOpen] = useDialogState<'delete'>(null)
  const [rowToDelete, setRowToDelete] = useState<IndicateurCmr | null>(null)

  const closeAll = useCallback(() => {
    setModal(null)
    setSelectedIndicateur(null)
    setSelectedIndicateurId(null)
  }, [])

  const handleView = useCallback((row: IndicateurCmr) => {
    setSelectedIndicateurId(row.id_ref_ind_cmr)
    setModal('indicateurView')
  }, [])

  const handleEdit = useCallback((row: IndicateurCmr) => {
    setSelectedIndicateur(row)
    setModal('indicateur')
  }, [])

  const handleDeleteRequest = useCallback(
    (row: IndicateurCmr) => {
      setRowToDelete(row)
      setDeleteOpen('delete')
    },
    [setDeleteOpen]
  )

  const columns = useMemo(
    () =>
      buildIndicateurCmrColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDeleteRequest: handleDeleteRequest,
      }),
    [handleView, handleEdit, handleDeleteRequest]
  )

  const handleConfirmDelete = (row: IndicateurCmr) => {
    deleteMutation.mutate(row.id_ref_ind_cmr, {
      onSuccess: () => {
        toast.success('Indicateur CMR supprimé avec succès')
        setRowToDelete(null)
        setDeleteOpen(null)
      },
      onError: () => toast.error('Erreur lors de la suppression'),
    })
  }

  return (
    <>
      <GenericTable<IndicateurCmr>
        key={`indicateurs-cmr-politique-${dataUpdatedAt}-${indicateurs.length}`}
        data={indicateurs}
        columns={columns}
        search={search}
        navigate={navigate}
        searchKey='intitule_ref_ind'
        searchPlaceholder='Filtrer les indicateurs CMR…'
        urlFilterConfig={[
          {
            columnId: 'intitule_ref_ind',
            searchKey: 'intitule_ref_ind',
            type: 'string',
          },
          {
            columnId: 'code_ref_ind',
            searchKey: 'code_ref_ind',
            type: 'string',
          },
        ]}
        defaultPageSize={10}
        showViewOptions={false}
        toolbarEndSlot={
          <div className='ms-auto flex flex-col gap-2 sm:flex-row'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='h-8 border-dashed'
              onClick={() => setCiblesOpen(true)}
            >
              <Target className='h-4 w-4' />
              Cibles CMR
            </Button>
            <DataTableToolbarOutlineButton
              onClick={() => {
                setSelectedIndicateur(null)
                setModal('indicateur')
              }}
            >
              Nouvel indicateur
            </DataTableToolbarOutlineButton>
          </div>
        }
        emptyMessage='Aucun indicateur CMR.'
      />

      {rowToDelete ? (
        <GenericDeleteDialog<IndicateurCmr>
          open={deleteOpen === 'delete'}
          onOpenChange={(isOpen) => setDeleteOpen(isOpen ? 'delete' : null)}
          currentRow={rowToDelete}
          entityName="l'indicateur CMR"
          getEntityLabel={(row) => row.intitule_ref_ind}
          onDelete={handleConfirmDelete}
        />
      ) : null}

      <CiblesCmrDialog open={ciblesOpen} onOpenChange={setCiblesOpen} />

      <Dialog open={modal === 'indicateur'} onOpenChange={(o) => !o && closeAll()}>
        <DialogContent
          className='gap-0 overflow-hidden p-0 sm:max-w-3xl'
          aria-describedby={undefined}
        >
          <DialogHeader className='border-b px-6 py-4'>
            <DialogTitle>
              {selectedIndicateur
                ? "Modifier l'indicateur CMR"
                : 'Créer un indicateur CMR'}
            </DialogTitle>
            <DialogDescription className='px-6 pb-0'>
              Référentiel global des indicateurs CMR (niveau politique).
            </DialogDescription>
          </DialogHeader>
          <div className='px-6 py-4'>
            <IndicateurCmrFormPanel
              key={selectedIndicateur?.id_ref_ind_cmr ?? 'new'}
              indicateur={selectedIndicateur}
              onClose={closeAll}
              onSuccess={closeAll}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={modal === 'indicateurView'}
        onOpenChange={(o) => !o && closeAll()}
      >
        <DialogContent
          className='gap-0 overflow-hidden p-0 sm:max-w-2xl'
          aria-describedby={undefined}
        >
          <DialogHeader className='border-b px-6 py-4'>
            <DialogTitle>Détails de l&apos;indicateur CMR</DialogTitle>
          </DialogHeader>
          <div className='px-6 py-5'>
            {selectedIndicateurId != null ? (
              <IndicateurCmrDetailView
                indicateurId={selectedIndicateurId}
                onClose={closeAll}
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
