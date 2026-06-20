import { useRef } from 'react'
import { FileText, FileUp, Trash2, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DateInput } from '@/components/ui/date-input'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type {
  DocumentationCmrFormData,
  FondCarteFormData,
  PeriodeSousRessourceType,
  SimpleSousRessourceFormData,
  SousRessourceDocumentsFormData,
} from '@/simadou/allTypes/periodeIndicateurSousRessource'
import { MAX_SOUS_RESSOURCE_DOCUMENTS } from '@/simadou/allTypes/periodeIndicateurSousRessource'
import {
  resolveDocumentFileName,
  resolveDocumentUrl,
} from '@/simadou/lib/documentProjetUtils'

const DOCUMENT_ACCEPT =
  'application/pdf,image/*,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip'

const COMPACT_TEXTAREA_CLASS = 'min-h-[56px] resize-y'

type SousRessourceFormFieldsProps = {
  resource: PeriodeSousRessourceType
  disabled?: boolean
  idPrefix?: string
  simpleForm?: SimpleSousRessourceFormData
  documentationForm?: DocumentationCmrFormData
  fondCarteForm?: FondCarteFormData
  onSimpleChange?: (
    key: keyof SimpleSousRessourceFormData,
    value: SimpleSousRessourceFormData[keyof SimpleSousRessourceFormData]
  ) => void
  onDocumentationChange?: (
    key: keyof DocumentationCmrFormData,
    value: DocumentationCmrFormData[keyof DocumentationCmrFormData]
  ) => void
  onDocumentationDocumentsChange?: (documents: SousRessourceDocumentsFormData) => void
  onFondCarteChange?: (
    key: keyof FondCarteFormData,
    value: FondCarteFormData[keyof FondCarteFormData]
  ) => void
  onFondCarteDocumentsChange?: (documents: SousRessourceDocumentsFormData) => void
}

function DocumentsFileField({
  id,
  disabled,
  documents,
  onDocumentsChange,
}: {
  id: string
  disabled?: boolean
  documents: SousRessourceDocumentsFormData
  onDocumentsChange: (next: SousRessourceDocumentsFormData) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const totalCount =
    documents.documentFiles.length + documents.existingDocuments.length
  const canAddMore = totalCount < MAX_SOUS_RESSOURCE_DOCUMENTS

  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList?.length) return

    const remaining = MAX_SOUS_RESSOURCE_DOCUMENTS - totalCount
    const incoming = Array.from(fileList).slice(0, remaining)

    onDocumentsChange({
      ...documents,
      documentFiles: [...documents.documentFiles, ...incoming],
    })

    if (inputRef.current) inputRef.current.value = ''
  }

  const removeNewFile = (index: number) => {
    onDocumentsChange({
      ...documents,
      documentFiles: documents.documentFiles.filter((_, i) => i !== index),
    })
  }

  const removeExistingDocument = (index: number) => {
    onDocumentsChange({
      ...documents,
      existingDocuments: documents.existingDocuments.filter((_, i) => i !== index),
    })
  }

  const clearAll = () => {
    onDocumentsChange({ documentFiles: [], existingDocuments: [] })
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className='space-y-2'>
      <Label htmlFor={id}>Documents</Label>
      <input
        ref={inputRef}
        id={id}
        type='file'
        accept={DOCUMENT_ACCEPT}
        multiple
        className='hidden'
        disabled={disabled || !canAddMore}
        onChange={(e) => handleFilesSelected(e.target.files)}
      />

      <div
        className={cn(
          'rounded-lg border transition-colors',
          totalCount > 0 ? 'border-border bg-muted/20 p-3' : 'border-dashed p-3'
        )}
      >
        {totalCount > 0 ? (
          <div className='space-y-2'>
            <div className='flex items-center justify-between gap-2'>
              <span className='text-xs text-muted-foreground'>
                {totalCount} fichier{totalCount > 1 ? 's' : ''}
                <span
                  className={cn(
                    'ms-1.5 rounded px-1.5 py-0.5 font-medium',
                    totalCount >= MAX_SOUS_RESSOURCE_DOCUMENTS
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {totalCount}/{MAX_SOUS_RESSOURCE_DOCUMENTS}
                </span>
              </span>
              <div className='flex shrink-0 items-center gap-0.5'>
                {canAddMore && (
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='h-7 px-2 text-xs'
                    onClick={() => inputRef.current?.click()}
                    disabled={disabled}
                  >
                    <Upload className='me-1 h-3 w-3' />
                    Ajouter
                  </Button>
                )}
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='h-7 px-2 text-xs text-destructive hover:text-destructive'
                  onClick={clearAll}
                  disabled={disabled}
                >
                  <Trash2 className='me-1 h-3 w-3' />
                  Tout effacer
                </Button>
              </div>
            </div>

            <div className='flex flex-col gap-1'>
              {documents.existingDocuments.map((doc, index) => {
                const href = resolveDocumentUrl(doc)
                const label = resolveDocumentFileName(doc)
                return (
                  <div
                    key={`existing-${doc}-${index}`}
                    className='flex items-center gap-2 rounded-md border bg-background/80 px-2.5 py-1.5'
                  >
                    <FileText className='h-3.5 w-3.5 shrink-0 text-primary/70' />
                    <div className='min-w-0 flex-1'>
                      {href ? (
                        <a
                          href={href}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='block truncate text-xs font-medium text-primary hover:underline'
                        >
                          {label}
                        </a>
                      ) : (
                        <p className='truncate text-xs font-medium text-foreground'>
                          {label}
                        </p>
                      )}
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='h-7 w-7 shrink-0'
                      onClick={() => removeExistingDocument(index)}
                      disabled={disabled}
                      aria-label={`Retirer ${label}`}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                )
              })}

              {documents.documentFiles.map((file, index) => (
                <div
                  key={`new-${file.name}-${index}`}
                  className='flex items-center gap-2 rounded-md border bg-background/80 px-2.5 py-1.5'
                >
                  <FileText className='h-3.5 w-3.5 shrink-0 text-primary/70' />
                  <p className='min-w-0 flex-1 truncate text-xs font-medium text-foreground'>
                    {file.name}
                  </p>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='h-7 w-7 shrink-0'
                    onClick={() => removeNewFile(index)}
                    disabled={disabled}
                    aria-label={`Retirer ${file.name}`}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <button
            type='button'
            className='flex w-full items-center justify-center gap-2 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50'
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
          >
            <FileUp className='h-4 w-4' />
            Sélectionner des fichiers (max. {MAX_SOUS_RESSOURCE_DOCUMENTS})
          </button>
        )}
      </div>
    </div>
  )
}

function DateValidationField({
  id,
  disabled,
  value,
  onChange,
}: {
  id: string
  disabled?: boolean
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className='space-y-2'>
      <Label htmlFor={id}>Date de validation</Label>
      <DateInput
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className='w-full max-w-xs'
      />
    </div>
  )
}

function SourceObservationRow({
  id,
  disabled,
  sourceDonnees,
  observation,
  onSourceChange,
  onObservationChange,
}: {
  id: (name: string) => string
  disabled?: boolean
  sourceDonnees: string
  observation: string
  onSourceChange: (value: string) => void
  onObservationChange: (value: string) => void
}) {
  return (
    <div className='grid gap-3 sm:grid-cols-2'>
      <div className='space-y-2'>
        <Label htmlFor={id('source-donnees')}>Source de données</Label>
        <Textarea
          id={id('source-donnees')}
          placeholder='Source de données'
          value={sourceDonnees}
          onChange={(e) => onSourceChange(e.target.value)}
          disabled={disabled}
          className={COMPACT_TEXTAREA_CLASS}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor={id('observation')}>Observations</Label>
        <Textarea
          id={id('observation')}
          placeholder='Observations'
          value={observation}
          onChange={(e) => onObservationChange(e.target.value)}
          disabled={disabled}
          className={COMPACT_TEXTAREA_CLASS}
        />
      </div>
    </div>
  )
}

export default function SousRessourceFormFields({
  resource,
  disabled = false,
  idPrefix = '',
  simpleForm,
  documentationForm,
  fondCarteForm,
  onSimpleChange,
  onDocumentationChange,
  onDocumentationDocumentsChange,
  onFondCarteChange,
  onFondCarteDocumentsChange,
}: SousRessourceFormFieldsProps) {
  const id = (name: string) => (idPrefix ? `${idPrefix}-${name}` : name)

  if (resource === 'documentations' && documentationForm && onDocumentationChange) {
    return (
      <div className='mx-auto w-full max-w-xl space-y-3'>
        <div className='grid gap-3 sm:grid-cols-2'>
          <div className='space-y-2'>
            <Label htmlFor={id('titre')}>Titre</Label>
            <Input
              id={id('titre')}
              placeholder='Titre du document'
              value={documentationForm.titre}
              onChange={(e) => onDocumentationChange('titre', e.target.value)}
              disabled={disabled}
              className='w-full'
            />
          </div>
          <DateValidationField
            id={id('date-validation')}
            disabled={disabled}
            value={documentationForm.date_validation}
            onChange={(value) => onDocumentationChange('date_validation', value)}
          />
        </div>

        <SourceObservationRow
          id={id}
          disabled={disabled}
          sourceDonnees={documentationForm.source_donnees}
          observation={documentationForm.observation}
          onSourceChange={(value) => onDocumentationChange('source_donnees', value)}
          onObservationChange={(value) => onDocumentationChange('observation', value)}
        />

        <DocumentsFileField
          id={id('documents')}
          disabled={disabled}
          documents={documentationForm}
          onDocumentsChange={
            onDocumentationDocumentsChange ??
            ((next) => {
              onDocumentationChange('documentFiles', next.documentFiles)
              onDocumentationChange('existingDocuments', next.existingDocuments)
            })
          }
        />
      </div>
    )
  }

  if (resource === 'fonds-carte' && fondCarteForm && onFondCarteChange) {
    return (
      <div className='mx-auto w-full max-w-xl space-y-3'>
        <DateValidationField
          id={id('date-validation')}
          disabled={disabled}
          value={fondCarteForm.date_validation}
          onChange={(value) => onFondCarteChange('date_validation', value)}
        />

        <SourceObservationRow
          id={id}
          disabled={disabled}
          sourceDonnees={fondCarteForm.source_donnees}
          observation={fondCarteForm.observation}
          onSourceChange={(value) => onFondCarteChange('source_donnees', value)}
          onObservationChange={(value) => onFondCarteChange('observation', value)}
        />

        <DocumentsFileField
          id={id('documents')}
          disabled={disabled}
          documents={fondCarteForm}
          onDocumentsChange={
            onFondCarteDocumentsChange ??
            ((next) => {
              onFondCarteChange('documentFiles', next.documentFiles)
              onFondCarteChange('existingDocuments', next.existingDocuments)
            })
          }
        />
      </div>
    )
  }

  if (!simpleForm || !onSimpleChange) return null

  return (
    <div className='mx-auto w-full max-w-xl space-y-3'>
      <DateValidationField
        id={id('date-validation')}
        disabled={disabled}
        value={simpleForm.date_validation}
        onChange={(value) => onSimpleChange('date_validation', value)}
      />

      <SourceObservationRow
        id={id}
        disabled={disabled}
        sourceDonnees={simpleForm.source_donnees}
        observation={simpleForm.observation}
        onSourceChange={(value) => onSimpleChange('source_donnees', value)}
        onObservationChange={(value) => onSimpleChange('observation', value)}
      />
    </div>
  )
}
