import { useCallback, useMemo, useState } from 'react'
import { FolderOpen, Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DIALOG_SIZES } from '@/Global/Forms/dialog'
import { GenericDeleteDialog } from '@/Global/Tableaux/GenericDeleteDialog'
import useDialogState from '@/hooks/use-dialog-state'
import type { Projet } from '@/simadou/allTypes'
import type { DossierProjet } from '@/simadou/allTypes/dossierProjet'
import {
  useDeleteDossierProjet,
  useGetDossiersProjet,
} from '@/simadou/allHooks/admin/dossierProjetHooks'
import { openDossierProjetInNewTab } from '@/simadou/allfonctionalities/projets/detail/projetDetailUtils'
import { cn } from '@/lib/utils'
import DossierProjetFormDialog from './DossierProjetFormDialog'

function DossierCard({
  dossier,
  onOpen,
  onEdit,
  onDelete,
}: {
  dossier: DossierProjet
  onOpen: (dossier: DossierProjet) => void
  onEdit: (dossier: DossierProjet) => void
  onDelete: (dossier: DossierProjet) => void
}) {
  return (
    <div
      className={cn(
        'group relative flex flex-col gap-3 rounded-xl border border-amber-200 bg-card p-4 transition-all duration-300',
        'hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg dark:border-amber-800/50'
      )}
    >
      <div className='absolute -top-2 -right-2'>
        <span className='inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600 shadow-sm dark:bg-amber-950/30 dark:text-amber-400'>
          Dossier
        </span>
      </div>

      <div className='flex items-start justify-between gap-2'>
        <button
          type='button'
          onClick={() => onOpen(dossier)}
          className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 transition-transform group-hover:scale-110 dark:bg-amber-950/30'
        >
          <FolderOpen className='h-6 w-6 text-amber-600 dark:text-amber-400' />
        </button>

        <div className='flex items-center gap-1 opacity-0 transition-all group-hover:opacity-100'>
          <button
            type='button'
            onClick={() => onEdit(dossier)}
            title='Modifier'
            className='flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-background text-muted-foreground transition-all hover:bg-muted hover:text-foreground hover:shadow-sm'
          >
            <Pencil className='h-3.5 w-3.5' />
          </button>
          <button
            type='button'
            onClick={() => onDelete(dossier)}
            title='Supprimer'
            className='flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-background text-muted-foreground transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30'
          >
            <Trash2 className='h-3.5 w-3.5' />
          </button>
        </div>
      </div>

      <button
        type='button'
        onClick={() => onOpen(dossier)}
        className='flex flex-1 flex-col gap-1 text-left'
      >
        <p className='line-clamp-2 text-sm leading-snug font-semibold text-foreground'>
          {dossier.nom_dossier?.trim() || 'Sans nom'}
        </p>
        <p className='line-clamp-3 text-xs text-muted-foreground'>
          {dossier.description_dossier?.trim() || 'Aucune description'}
        </p>
      </button>

      <Button
        type='button'
        variant='outline'
        size='sm'
        className='w-full border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800/50 dark:text-amber-400 dark:hover:bg-amber-950/30'
        onClick={() => onOpen(dossier)}
      >
        Ouvrir le dossier
      </Button>
    </div>
  )
}

type ProjetDocumentsPanelProps = {
  projet: Projet
}

export default function ProjetDocumentsPanel({ projet }: ProjetDocumentsPanelProps) {
  const idProjet = projet.id_projet
  const { data: dossiers = [], isLoading } = useGetDossiersProjet(idProjet)
  const deleteMutation = useDeleteDossierProjet(idProjet)

  const [formOpen, setFormOpen] = useState(false)
  const [selectedDossier, setSelectedDossier] = useState<DossierProjet | null>(
    null
  )
  const [deleteOpen, setDeleteOpen] = useDialogState<'delete'>(null)
  const [dossierToDelete, setDossierToDelete] = useState<DossierProjet | null>(
    null
  )

  const dossierCountLabel = useMemo(
    () => `${dossiers.length} dossier(s)`,
    [dossiers.length]
  )

  const handleAdd = () => {
    setSelectedDossier(null)
    setFormOpen(true)
  }

  const handleEdit = useCallback((dossier: DossierProjet) => {
    setSelectedDossier(dossier)
    setFormOpen(true)
  }, [])

  const handleDelete = useCallback(
    (dossier: DossierProjet) => {
      setDossierToDelete(dossier)
      setDeleteOpen('delete')
    },
    [setDeleteOpen]
  )

  const handleCloseForm = () => {
    setFormOpen(false)
    setSelectedDossier(null)
  }

  const handleOpenDossier = useCallback(
    (dossier: DossierProjet) => {
      openDossierProjetInNewTab(projet, dossier.id_dossier)
    },
    [projet]
  )

  const handleConfirmDelete = (dossier: DossierProjet) => {
    deleteMutation.mutate(dossier.id_dossier, {
      onSuccess: () => {
        setDossierToDelete(null)
        setDeleteOpen(null)
      },
    })
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <p className='text-sm text-muted-foreground'>
          Organisez les documents du projet par dossier
        </p>
        <Button onClick={handleAdd} className='shadow-sm'>
          <Plus className='h-4 w-4' />
          Créer un dossier
        </Button>
      </div>

      {!isLoading && dossiers.length > 0 && (
        <div className='flex flex-wrap gap-3'>
          <div className='flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'>
            <FolderOpen className='h-3 w-3' />
            <span>{dossierCountLabel}</span>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className='flex justify-center py-16'>
          <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        </div>
      ) : dossiers.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border/60 bg-muted/20 py-16 text-center'>
          <div className='rounded-full bg-primary/10 p-4'>
            <FolderOpen className='h-8 w-8 text-primary/60' />
          </div>
          <div>
            <p className='text-sm font-medium text-foreground'>Aucun dossier</p>
            <p className='text-xs text-muted-foreground'>
              Créez un dossier pour y ajouter des documents
            </p>
          </div>
          <Button variant='outline' size='sm' onClick={handleAdd} className='mt-2'>
            <Plus className='h-3.5 w-3.5' /> Créer un dossier
          </Button>
        </div>
      ) : (
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
          {dossiers.map((dossier) => (
            <DossierCard
              key={dossier.id_dossier}
              dossier={dossier}
              onOpen={handleOpenDossier}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
          <button
            type='button'
            onClick={handleAdd}
            className='group flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border/50 bg-transparent transition-all hover:border-primary/40 hover:bg-primary/5'
          >
            <div className='rounded-full bg-muted/50 p-3 transition-all group-hover:scale-110 group-hover:bg-primary/10'>
              <Plus className='h-6 w-6 text-muted-foreground transition-all group-hover:text-primary' />
            </div>
            <span className='text-xs font-medium text-muted-foreground transition-all group-hover:text-primary'>
              Ajouter
            </span>
          </button>
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={(open) => !open && handleCloseForm()}>
        <DialogContent className={DIALOG_SIZES.md}>
          <DialogHeader>
            <DialogTitle>
              {selectedDossier ? 'Modifier le dossier' : 'Créer un dossier'}
            </DialogTitle>
            <DialogDescription>
              {selectedDossier
                ? 'Modifiez le nom ou la description du dossier.'
                : 'Créez un dossier pour regrouper les documents du projet.'}
            </DialogDescription>
          </DialogHeader>
          <DossierProjetFormDialog
            projet={projet}
            dossier={selectedDossier}
            onClose={handleCloseForm}
            onSuccess={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {dossierToDelete && (
        <GenericDeleteDialog<DossierProjet>
          open={deleteOpen === 'delete'}
          onOpenChange={(isOpen) => setDeleteOpen(isOpen ? 'delete' : null)}
          currentRow={dossierToDelete}
          entityName='le dossier'
          getEntityLabel={(row) => row.nom_dossier?.trim() || 'Dossier'}
          onDelete={handleConfirmDelete}
        />
      )}
    </div>
  )
}
