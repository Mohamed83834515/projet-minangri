'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/others/confirm-dialog'

type GenericMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
  /**
   * Singular entity name used in toasts and the title.
   * @example "user" | "product" | "order"
   */
  entityName: string
  /**
   * Plural form. Falls back to `entityName + "s"` when omitted.
   * @example "people" — otherwise "users", "products", etc.
   */
  entityNamePlural?: string
  /**
   * Called with the selected rows after confirmation.
   * Falls back to a 2 s sleep + toast when omitted.
   */
  onDelete?: (rows: TData[]) => void | Promise<void>
}

const CONFIRM_WORD = 'DELETE'
const FORM_ID = 'generic-multi-delete-form'

export function GenericMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
  entityName,
  entityNamePlural,
  onDelete,
}: GenericMultiDeleteDialogProps<TData>) {
  const [value, setValue] = useState('')

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const count = selectedRows.length
  const plural = entityNamePlural ?? `${entityName}s`
  const label = count === 1 ? entityName : plural
  const isConfirmed = value.trim() === CONFIRM_WORD

  const handleDelete = async () => {
    if (!isConfirmed) {
      toast.error(`Please type "${CONFIRM_WORD}" to confirm.`)
      return
    }

    onOpenChange(false)

    const rows = selectedRows.map((r) => r.original)

    if (onDelete) {
      await onDelete(rows)
      setValue('')
      table.resetRowSelection()
      return
    }

    // Default behaviour: optimistic toast
    toast.promise(sleep(2000), {
      loading: `Deleting ${label}…`,
      success: () => {
        setValue('')
        table.resetRowSelection()
        return `Deleted ${count} ${label}`
      },
      error: `Error deleting ${label}`,
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setValue('')
        onOpenChange(next)
      }}
      form={FORM_ID}
      disabled={!isConfirmed}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete {count} {label}
        </span>
      }
      desc={
        <form
          id={FORM_ID}
          onSubmit={(e) => {
            e.preventDefault()
            handleDelete()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            Are you sure you want to delete the selected {label}?
            <br />
            This action cannot be undone.
          </p>

          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span>Confirm by typing &quot;{CONFIRM_WORD}&quot;:</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
              autoFocus
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation cannot be rolled back.
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText='Delete'
      destructive
    />
  )
}