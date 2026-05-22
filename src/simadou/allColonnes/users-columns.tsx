import { type Row } from '@tanstack/react-table'
import { GenericRowActions } from '@/Global/Tableaux/GenericRowActions'
import { buildColumns, type OptionItem } from '@/Global/Tableaux/column-builder'
import { type User } from '@/simadou/schemas/allSchema'
import { UserPen, Trash2 } from 'lucide-react'
import { callTypes, roles } from '@/simadou/allfonctionalities/users/data'

type UsersDialogType = 'edit' | 'delete'

type UsersRowActionsProps = {
  row: Row<User>
  setOpen: (dialog: UsersDialogType | null) => void
  setCurrentRow: React.Dispatch<React.SetStateAction<User | null>>
}

function UsersRowActions({
  row,
  setOpen,
  setCurrentRow,
}: UsersRowActionsProps) {
  return (
    <GenericRowActions
      row={row}
      actions={[
        {
          label: 'Edit',
          icon: <UserPen size={16} />,
          onClick: (user) => {
            setCurrentRow(user)
            setOpen('edit')
          },
        },
        {
          label: 'Delete',
          icon: <Trash2 size={16} />,
          onClick: (user) => {
            setCurrentRow(user)
            setOpen('delete')
          },
          className: 'text-red-500!',
          separator: true,
        },
      ]}
    />
  )
}

export const buildUsersColumns = (
  setOpen: (dialog: UsersDialogType | null) => void,
  setCurrentRow: React.Dispatch<React.SetStateAction<User | null>>
) =>
  buildColumns<User>([
    { type: 'select' },
    { type: 'text', key: 'username', title: 'Username', sticky: true },
    { type: 'combined', keys: ['name'], id: 'fullName', title: 'Name' },
    { type: 'plain', key: 'email', title: 'Email' },
    { type: 'badge', key: 'status', title: 'Status', badgeMap: callTypes },
    {
      type: 'icon-label',
      key: 'role',
      title: 'Role',
      options: roles as OptionItem[],
    },
    {
      type: 'actions',
      cell: (props) => (
        <UsersRowActions
          {...props}
          setOpen={setOpen}
          setCurrentRow={setCurrentRow}
        />
      ),
    },
  ])
