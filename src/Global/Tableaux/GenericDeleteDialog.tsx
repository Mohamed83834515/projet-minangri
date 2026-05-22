import { AlertTriangle } from 'lucide-react'
import { ConfirmDialog } from '@/components/others/confirm-dialog'

type GenericDeleteDialogProps<T> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: T
  entityName?: string
  getEntityLabel?: (row: T) => string
  onDelete: (row: T) => void
}

export function GenericDeleteDialog<T>({
  open,
  onOpenChange,
  currentRow,
  entityName = 'élément',
  getEntityLabel,
  onDelete,
}: GenericDeleteDialogProps<T>) {
  const handleDelete = () => {
    onOpenChange(false)
    onDelete(currentRow)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      title={
        <span className='text-destructive'>
          <AlertTriangle className='me-1 inline-block stroke-destructive' size={18} />
          Supprimer {entityName}
        </span>
      }
      desc={
        <p>
          Voulez-vous vraiment supprimer{' '}
          {getEntityLabel && (
            <span className='font-bold'>{getEntityLabel(currentRow)}</span>
          )}{' '}
          ? Cette action est irréversible.
        </p>
      }
      confirmText='Supprimer'
      destructive
    />
  )
}