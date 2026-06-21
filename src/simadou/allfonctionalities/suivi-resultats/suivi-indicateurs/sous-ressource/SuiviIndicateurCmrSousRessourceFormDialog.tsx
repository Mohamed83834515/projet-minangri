import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { DIALOG_SIZES } from '@/Global/Forms/dialog'
import { formPrimaryButtonClassName } from '@/Global/Forms/form-footer-styles'
import { getApiErrorMessage } from '@/lib/api-error-message'
import { useMe } from '@/simadou/allHooks/auth/authHooks'
import {
  useCreatePeriodeSousRessource,
  useUpdatePeriodeSousRessource,
} from '@/simadou/allHooks/admin/periodeIndicateurSousRessourceHooks'
import type {
  DocumentationCmrEnregistrement,
  DocumentationCmrFormData,
  FondCarteEnregistrement,
  FondCarteFormData,
  PeriodeSousRessourceEnregistrement,
  PeriodeSousRessourceType,
  SimpleSousRessourceFormData,
  SousRessourceDocumentsFormData,
  TableauSyntheseEnregistrement,
} from '@/simadou/allTypes/periodeIndicateurSousRessource'
import {
  MAX_SOUS_RESSOURCE_DOCUMENTS,
  PERIODE_SOUS_RESSOURCE_LABELS,
} from '@/simadou/allTypes/periodeIndicateurSousRessource'
import { resolvePeriodeEnregistrementId } from '@/simadou/lib/periodeSousRessourceUtils'
import {
  buildDocumentationCmrWritePayload,
  buildFondCarteWritePayload,
  buildSimpleSousRessourceWritePayload,
  documentationCmrToFormValues,
  emptyDocumentationCmrFormValues,
  emptyFondCarteFormValues,
  emptySimpleSousRessourceFormValues,
  fondCarteToFormValues,
  simpleSousRessourceToFormValues,
} from './periodeSousRessourceFormUtils'
import SousRessourceFormFields from './SousRessourceFormFields'

type SuiviIndicateurCmrSousRessourceFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  resource: PeriodeSousRessourceType
  parentPeriodeId: number
  currentRow?: PeriodeSousRessourceEnregistrement | null
}

function countDocuments(documents: SousRessourceDocumentsFormData) {
  return documents.documentFiles.length + documents.existingDocuments.length
}

function validateDocuments(
  documents: SousRessourceDocumentsFormData,
  isEditing: boolean
): boolean {
  const total = countDocuments(documents)

  if (total === 0) {
    toast.error('Sélectionnez au moins un document à téléverser.')
    return false
  }

  if (total > MAX_SOUS_RESSOURCE_DOCUMENTS) {
    toast.error(`Vous ne pouvez pas ajouter plus de ${MAX_SOUS_RESSOURCE_DOCUMENTS} documents.`)
    return false
  }

  if (!isEditing && documents.documentFiles.length === 0) {
    toast.error('Sélectionnez au moins un fichier à téléverser.')
    return false
  }

  return true
}

export default function SuiviIndicateurCmrSousRessourceFormDialog({
  open,
  onOpenChange,
  resource,
  parentPeriodeId,
  currentRow,
}: SuiviIndicateurCmrSousRessourceFormDialogProps) {
  const isEditing = !!currentRow
  const { data: user } = useMe()
  const createMutation = useCreatePeriodeSousRessource(parentPeriodeId, resource)
  const updateMutation = useUpdatePeriodeSousRessource(parentPeriodeId, resource)

  const [simpleForm, setSimpleForm] = useState<SimpleSousRessourceFormData>(
    emptySimpleSousRessourceFormValues()
  )
  const [documentationForm, setDocumentationForm] =
    useState<DocumentationCmrFormData>(emptyDocumentationCmrFormValues())
  const [fondCarteForm, setFondCarteForm] =
    useState<FondCarteFormData>(emptyFondCarteFormValues())

  useEffect(() => {
    if (!open) return

    if (resource === 'documentations') {
      setDocumentationForm(
        isEditing
          ? documentationCmrToFormValues(currentRow as DocumentationCmrEnregistrement)
          : emptyDocumentationCmrFormValues()
      )
      return
    }

    if (resource === 'fonds-carte') {
      setFondCarteForm(
        isEditing
          ? fondCarteToFormValues(currentRow as FondCarteEnregistrement)
          : emptyFondCarteFormValues()
      )
      return
    }

    const row = currentRow as TableauSyntheseEnregistrement | null | undefined

    setSimpleForm(
      isEditing ? simpleSousRessourceToFormValues(row) : emptySimpleSousRessourceFormValues()
    )
  }, [open, isEditing, currentRow, resource])

  const isPending = createMutation.isPending || updateMutation.isPending
  const resourceLabel = PERIODE_SOUS_RESSOURCE_LABELS[resource]

  const handleSubmit = async () => {
    const personnelId = user?.n_personnel
    if (!personnelId) {
      toast.error('Utilisateur non identifié.')
      return
    }

    let mutationInput:
      | ReturnType<typeof buildSimpleSousRessourceWritePayload>
      | {
          data: ReturnType<typeof buildDocumentationCmrWritePayload>
          documents: {
            newFiles: File[]
            existingDocuments: string[]
          }
        }
      | {
          data: ReturnType<typeof buildFondCarteWritePayload>
          documents: {
            newFiles: File[]
            existingDocuments: string[]
          }
        }
      | null = null

    if (resource === 'documentations') {
      if (!documentationForm.titre.trim()) {
        toast.error('Le titre est obligatoire.')
        return
      }
      if (!validateDocuments(documentationForm, isEditing)) return

      mutationInput = {
        data: buildDocumentationCmrWritePayload({
          form: documentationForm,
          parentPeriodeId,
          personnelId,
          isEdit: isEditing,
        }),
        documents: {
          newFiles: documentationForm.documentFiles,
          existingDocuments: documentationForm.existingDocuments,
        },
      }
    } else if (resource === 'fonds-carte') {
      if (!validateDocuments(fondCarteForm, isEditing)) return

      mutationInput = {
        data: buildFondCarteWritePayload({
          form: fondCarteForm,
          parentPeriodeId,
          personnelId,
          isEdit: isEditing,
        }),
        documents: {
          newFiles: fondCarteForm.documentFiles,
          existingDocuments: fondCarteForm.existingDocuments,
        },
      }
    } else {
      mutationInput = buildSimpleSousRessourceWritePayload({
        form: simpleForm,
        parentPeriodeId,
        personnelId,
        isEdit: isEditing,
      })
    }

    if (!mutationInput) return

    try {
      if (isEditing && currentRow) {
        const itemId = resolvePeriodeEnregistrementId(currentRow, resource)
        if (itemId == null) {
          toast.error('Enregistrement introuvable.')
          return
        }

        if ('data' in mutationInput) {
          await updateMutation.mutateAsync({
            itemId,
            data: mutationInput.data,
            documents: mutationInput.documents,
          })
        } else {
          await updateMutation.mutateAsync({ itemId, data: mutationInput })
        }

        toast.success(`${resourceLabel} modifié(e)`)
      } else {
        if ('data' in mutationInput) {
          await createMutation.mutateAsync({
            data: mutationInput.data,
            documents: mutationInput.documents,
          })
        } else {
          await createMutation.mutateAsync(mutationInput)
        }

        toast.success(`${resourceLabel} ajouté(e)`)
      }

      onOpenChange(false)
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          isEditing
            ? `Erreur lors de la modification du ${resourceLabel}`
            : `Erreur lors de l'ajout du ${resourceLabel}`
        )
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(DIALOG_SIZES.md, 'gap-0 p-0')}
        aria-describedby={undefined}
      >
        <DialogHeader className='border-b px-6 py-4 pr-12'>
          <DialogTitle>
            {isEditing ? 'Modifier' : 'Ajouter'} un(e) {resourceLabel}
          </DialogTitle>
        </DialogHeader>

        <div className='px-6 py-4'>
          <SousRessourceFormFields
            resource={resource}
            disabled={isPending}
            idPrefix={`${resource}-form`}
            simpleForm={resource === 'tableaux-synthese' ? simpleForm : undefined}
            documentationForm={
              resource === 'documentations' ? documentationForm : undefined
            }
            fondCarteForm={resource === 'fonds-carte' ? fondCarteForm : undefined}
            onSimpleChange={(key, value) =>
              setSimpleForm((prev) => ({ ...prev, [key]: value }))
            }
            onDocumentationChange={(key, value) =>
              setDocumentationForm((prev) => ({ ...prev, [key]: value }))
            }
            onDocumentationDocumentsChange={(documents) =>
              setDocumentationForm((prev) => ({ ...prev, ...documents }))
            }
            onFondCarteChange={(key, value) =>
              setFondCarteForm((prev) => ({ ...prev, [key]: value }))
            }
            onFondCarteDocumentsChange={(documents) =>
              setFondCarteForm((prev) => ({ ...prev, ...documents }))
            }
          />
        </div>

        <DialogFooter className='border-t px-6 py-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Annuler
          </Button>
          <Button
            type='button'
            className={formPrimaryButtonClassName}
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending && <Loader2 className='h-4 w-4 animate-spin' />}
            {isEditing ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
