import { useCallback, useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { GenericTable } from '@/Global/Generic/Generictable'
import { DIALOG_SIZES } from '@/Global/Forms/dialog'
import { GenericDeleteDialog } from '@/Global/Tableaux/GenericDeleteDialog'
import { DataTableToolbarOutlineButton } from '@/components/data-table/toolbar-outline-button'
import useDialogState from '@/hooks/use-dialog-state'
import { useEmbeddedTableState } from '@/hooks/use-embedded-table-state'
import type { Projet } from '@/simadou/allTypes'
import type { DossierProjet } from '@/simadou/allTypes/dossierProjet'
import type { DocumentProjet } from '@/simadou/allTypes/documentProjet'
import { buildDocumentProjetColumns } from '@/simadou/allColonnes/document-projet-columns'
import {
  useDeleteDocumentProjet,
  useGetDocumentsDossier,
} from '@/simadou/allHooks/admin/documentProjetHooks'
import DocumentProjetFormDialog from './DocumentProjetFormDialog'

type ProjetDossierDocumentsPanelProps = {
  projet: Projet
  dossier: DossierProjet
}

export default function ProjetDossierDocumentsPanel({
  projet,
  dossier,
}: ProjetDossierDocumentsPanelProps) {
  const idDossier = dossier.id_dossier
  const { search, navigate } = useEmbeddedTableState()

  const { data: documents = [], isLoading } = useGetDocumentsDossier(idDossier)
  const deleteMutation = useDeleteDocumentProjet(idDossier)

  const [formOpen, setFormOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<DocumentProjet | null>(
    null
  )
  const [deleteOpen, setDeleteOpen] = useDialogState<'delete'>(null)
  const [documentToDelete, setDocumentToDelete] = useState<DocumentProjet | null>(
    null
  )

  const handleAdd = () => {
    setSelectedDocument(null)
    setFormOpen(true)
  }

  const handleEdit = useCallback((doc: DocumentProjet) => {
    setSelectedDocument(doc)
    setFormOpen(true)
  }, [])

  const handleCloseForm = () => {
    setFormOpen(false)
    setSelectedDocument(null)
  }

  const columns = useMemo(
    () =>
      buildDocumentProjetColumns(setDeleteOpen, setDocumentToDelete, handleEdit),
    [handleEdit, setDeleteOpen]
  )

  const handleConfirmDelete = (doc: DocumentProjet) => {
    deleteMutation.mutate(doc.id_document, {
      onSuccess: () => {
        setDocumentToDelete(null)
        setDeleteOpen(null)
      },
    })
  }

  if (isLoading) {
    return (
      <div className='flex justify-center py-16'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='rounded-lg border bg-muted/20 px-4 py-3'>
        <h3 className='text-sm font-semibold'>{dossier.nom_dossier}</h3>
        {dossier.description_dossier?.trim() ? (
          <p className='mt-1 text-sm text-muted-foreground'>
            {dossier.description_dossier}
          </p>
        ) : null}
      </div>

      <GenericTable<DocumentProjet>
        data={documents}
        columns={columns}
        search={search}
        navigate={navigate}
        searchKey='description_document'
        searchPlaceholder='Filtrer les documents…'
        urlFilterConfig={[
          {
            columnId: 'description_document',
            searchKey: 'description_document',
            type: 'string',
          },
        ]}
        toolbarEndSlot={
          <DataTableToolbarOutlineButton className='ms-auto' onClick={handleAdd}>
            Ajouter
          </DataTableToolbarOutlineButton>
        }
        defaultPageSize={10}
        compactPagination
        showViewOptions={false}
        emptyMessage='Aucun document dans ce dossier.'
      />

      <Dialog open={formOpen} onOpenChange={(open) => !open && handleCloseForm()}>
        <DialogContent className={DIALOG_SIZES.md}>
          <DialogHeader>
            <DialogTitle>
              {selectedDocument ? 'Modifier le document' : 'Ajouter un document'}
            </DialogTitle>
            <DialogDescription>
              {selectedDocument
                ? 'Modifiez la description ou remplacez le fichier.'
                : 'Téléversez un document dans ce dossier.'}
            </DialogDescription>
          </DialogHeader>
          <DocumentProjetFormDialog
            projet={projet}
            dossier={dossier}
            document={selectedDocument}
            onClose={handleCloseForm}
            onSuccess={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {documentToDelete && (
        <GenericDeleteDialog<DocumentProjet>
          open={deleteOpen === 'delete'}
          onOpenChange={(isOpen) => setDeleteOpen(isOpen ? 'delete' : null)}
          currentRow={documentToDelete}
          entityName='le document'
          getEntityLabel={(row) =>
            row.description_document?.trim() || 'Document'
          }
          onDelete={handleConfirmDelete}
        />
      )}
    </div>
  )
}
