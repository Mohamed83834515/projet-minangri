import { type Table } from '@tanstack/react-table'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'

type GenericBulkActionsProps<TData> = {
  table: Table<TData>
  /** Nom de l'entité au singulier pour le label (ex: 'user', 'product') */
  entityName: string
  /** Actions custom à afficher dans la toolbar (boutons icon) */
  children?: React.ReactNode
  /** Dialog de suppression multiple, reçoit table + open + onOpenChange */
  multiDeleteDialog?: (props: {
    table: Table<TData>
    open: boolean
    onOpenChange: (open: boolean) => void
  }) => React.ReactNode
}

/**
 * Wrapper générique autour de BulkActionsToolbar.
 *
 * Usage dans users/ :
 *   <GenericBulkActions table={table} entityName='user'
 *     multiDeleteDialog={(props) => <UsersMultiDeleteDialog {...props} />}
 *   >
 *     <Tooltip>
 *       <TooltipTrigger asChild>
 *         <Button variant='outline' size='icon' onClick={handleBulkInvite} className='size-8'>
 *           <Mail />
 *         </Button>
 *       </TooltipTrigger>
 *       <TooltipContent><p>Invite selected users</p></TooltipContent>
 *     </Tooltip>
 *   </GenericBulkActions>
 */
import { useState } from 'react'

export function GenericBulkActions<TData>({
  table,
  entityName,
  children,
  multiDeleteDialog,
}: GenericBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <>
      <BulkActionsToolbar table={table} entityName={entityName}>
        {children}
      </BulkActionsToolbar>

      {multiDeleteDialog?.({
        table,
        open: showDeleteConfirm,
        onOpenChange: setShowDeleteConfirm,
      })}
    </>
  )
}