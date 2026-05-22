import { useState, useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { GenericBulkActions } from '@/Global/Generic/Genericbulkactions'
import { GenericDialogs } from '@/Global/Generic/Genericdialogs'
import { GenericMultiDeleteDialog } from '@/Global/Generic/Genericmultideletedialog'
import { GenericTable } from '@/Global/Generic/Generictable'
import { GenericDeleteDialog } from '@/Global/Tableaux/GenericDeleteDialog'
import { useGetusers } from '@/simadou/allHooks/admin/userHooks'
import { type User } from '@/simadou/schemas/allSchema'
import { Mail, UserCheck, UserX } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import useDialogState from '@/hooks/use-dialog-state'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { roles } from '@/simadou/allfonctionalities/users/data'
import { buildUsersColumns } from '../../allColonnes/users-columns'
import EditUser from './EditUser'

const route = getRouteApi('/_authenticated/users/')

function ListeUsers() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  //
  const { data: users = [] } = useGetusers()

  const [open, setOpen] = useDialogState<'invite' | 'add' | 'edit' | 'delete'>(
    null
  )
  const [currentRow, setCurrentRow] = useState<User | null>(null)

  const columns = useMemo(
    () => buildUsersColumns(setOpen, setCurrentRow),
    [setOpen, setCurrentRow]
  )

  return (
    <>
      <GenericTable<User>
        data={users}
        columns={columns}
        search={search}
        navigate={navigate}
        searchKey='username'
        searchPlaceholder='Filter users...'
        urlFilterConfig={[
          { columnId: 'username', searchKey: 'username', type: 'string' },
          { columnId: 'status', searchKey: 'status', type: 'array' },
          { columnId: 'role', searchKey: 'role', type: 'array' },
        ]}
        facetedFilters={[
          {
            columnId: 'status',
            title: 'Status',
            options: [
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
              { label: 'Invited', value: 'invited' },
              { label: 'Suspended', value: 'suspended' },
            ],
          },
          {
            columnId: 'role',
            title: 'Role',
            options: roles.map((r) => ({ ...r })),
          },
        ]}
        bulkActionsSlot={(table) => {
          const selected = table
            .getFilteredSelectedRowModel()
            .rows.map((r) => r.original as User)
          const reset = () => table.resetRowSelection()

          const handleStatus = (status: 'active' | 'inactive') => {
            toast.promise(sleep(2000), {
              loading: `${status === 'active' ? 'Activating' : 'Deactivating'} users...`,
              success: () => {
                reset()
                return `${status === 'active' ? 'Activated' : 'Deactivated'} ${selected.length} user(s)`
              },
              error: 'Error',
            })
          }

          const handleInvite = () => {
            toast.promise(sleep(2000), {
              loading: 'Inviting users...',
              success: () => {
                reset()
                return `Invited ${selected.length} user(s)`
              },
              error: 'Error inviting users',
            })
          }

          return (
            <GenericBulkActions
              table={table}
              entityName='user'
              multiDeleteDialog={(props) => (
                <GenericMultiDeleteDialog {...props} entityName='user' />
              )}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={handleInvite}
                    className='size-8'
                  >
                    <Mail />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Invite selected</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => handleStatus('active')}
                    className='size-8'
                  >
                    <UserCheck />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Activate selected</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => handleStatus('inactive')}
                    className='size-8'
                  >
                    <UserX />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Deactivate selected</p>
                </TooltipContent>
              </Tooltip>
            </GenericBulkActions>
          )
        }}
      />

      <GenericDialogs<User, 'add' | 'edit' | 'delete' | 'invite'>
        open={open}
        setOpen={setOpen}
        currentRow={currentRow}
        setCurrentRow={setCurrentRow}
        rowRequiredDialogs={['edit', 'delete']}
        dialogMap={{
          edit: (props) => (
            <EditUser
              key={`user-edit-${currentRow?.id}`}
              open={props.open}
              onOpenChange={props.onOpenChange}
              currentRow={props.currentRow as User}
            />
          ),
          delete: (props) => (
            <GenericDeleteDialog<User>
              key={`user-delete-${currentRow?.id}`}
              {...props}
              currentRow={props.currentRow as User}
              entityName='user'
              getEntityLabel={(row) => row.username}
              onDelete={(row) =>
                toast.success(`Utilisateur ${row.username} supprimé`)
              }
            />
          ),
        }}
      />
    </>
  )
}

export default ListeUsers
