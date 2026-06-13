import { useCallback, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DIALOG_SIZES } from '@/Global/Forms/dialog'
import { GenericTable } from '@/Global/Generic/Generictable'
import { GenericDeleteDialog } from '@/Global/Tableaux/GenericDeleteDialog'
import useDialogState from '@/hooks/use-dialog-state'
import { useEmbeddedTableState } from '@/hooks/use-embedded-table-state'
import type { Projet } from '@/simadou/allTypes'
import type { DocumentProjet } from '@/simadou/allTypes/documentProjet'
import { buildDocumentProjetColumns } from '@/simadou/allColonnes/document-projet-columns'
import {
  useDeleteDocumentProjet,
  useGetDocumentsProjet,
} from '@/simadou/allHooks/admin/documentProjetHooks'
import DocumentProjetFormDialog from './DocumentProjetFormDialog'

type ProjetDocumentsPanelProps = {
  projet: Projet
}

export default function ProjetDocumentsPanel({ projet }: ProjetDocumentsPanelProps) {
  const idProjet = projet.id_projet
  const { search, navigate } = useEmbeddedTableState()
  const { data: documents = [], isLoading } = useGetDocumentsProjet(idProjet)
  const deleteMutation = useDeleteDocumentProjet(idProjet)

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

  const handleEdit = useCallback((document: DocumentProjet) => {
    setSelectedDocument(document)
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

  const handleConfirmDelete = (document: DocumentProjet) => {
    deleteMutation.mutate(document.id_document, {
      onSuccess: () => {
        setDocumentToDelete(null)
        setDeleteOpen(null)
      },
    })
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <p className='text-sm text-muted-foreground'>
          Documents rattachés au projet{' '}
          <span className='font-medium text-foreground'>
            {projet.code_projet}
          </span>
          .
        </p>
        <Button type='button' onClick={handleAdd}>
          <Plus className='h-4 w-4' />
          Ajouter un document
        </Button>
      </div>

      <GenericTable<DocumentProjet>
        data={documents}
        columns={columns}
        search={search}
        navigate={navigate}
        searchKey='description_document'
        searchPlaceholder='Filtrer par description…'
        urlFilterConfig={[
          {
            columnId: 'description_document',
            searchKey: 'description_document',
            type: 'string',
          },
        ]}
        defaultPageSize={10}
        showViewOptions={false}
        emptyMessage={
          isLoading
            ? 'Chargement des documents…'
            : 'Aucun document pour ce projet.'
        }
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
                : 'Téléversez un document et ajoutez une description.'}
            </DialogDescription>
          </DialogHeader>
          <DocumentProjetFormDialog
            projet={projet}
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
            row.description_document?.trim() ||
            row.document?.split('/').pop() ||
            'Document'
          }
          onDelete={handleConfirmDelete}
        />
      )}
    </div>
  )
}
