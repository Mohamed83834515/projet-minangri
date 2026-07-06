import { useMemo, useState } from 'react'
import { GenericTable } from '@/Global/Generic/Generictable'
import { GenericDialogs } from '@/Global/Generic/Genericdialogs'
import { GenericDeleteDialog } from '@/Global/Tableaux/GenericDeleteDialog'
import { useEmbeddedTableState } from '@/hooks/use-embedded-table-state'
import useDialogState from '@/hooks/use-dialog-state'
import { buildConventionColumns } from '@/simadou/allColonnes/convention-columns'
import {
  useDeleteConvention,
  useGetConventions,
} from '@/simadou/allHooks/admin/conventionHooks'
import type { Convention } from '@/simadou/allTypes/convention'
import AddConvention from './AddConvention'

export default function ListeConvention() {
  const { search, navigate } = useEmbeddedTableState()
  const [open, setOpen] = useDialogState<'add' | 'edit' | 'delete'>(null)
  const [currentRow, setCurrentRow] = useState<Convention | null>(null)
  const { data = [], isLoading } = useGetConventions()
  const deleteMutation = useDeleteConvention()

  const columns = useMemo(
    () => buildConventionColumns(setOpen, setCurrentRow),
    [setOpen, setCurrentRow]
  )

  return (
    <div className='space-y-2'>
      <GenericTable
        data={data}
        columns={columns}
        search={search}
        navigate={navigate}
        isLoading={isLoading}
        searchKey='intutile_conv'
        searchPlaceholder='Filtrer les conventions...'
        urlFilterConfig={[
          {
            columnId: 'code_convention',
            searchKey: 'code_convention',
            type: 'string',
          },
          {
            columnId: 'intutile_conv',
            searchKey: 'intutile_conv',
            type: 'string',
          },
          {
            columnId: 'reference_conv',
            searchKey: 'reference_conv',
            type: 'string',
          },
        ]}
        defaultPageSize={10}
        showViewOptions
        emptyMessage='Aucune convention trouvée.'
      />

      <GenericDialogs<Convention, 'add' | 'edit' | 'delete'>
        open={open}
        setOpen={setOpen}
        currentRow={currentRow}
        setCurrentRow={setCurrentRow}
        rowRequiredDialogs={['edit', 'delete']}
        dialogMap={{
          add: (props) => (
            <AddConvention
              key='convention-add'
              open={props.open}
              onOpenChange={props.onOpenChange}
              currentRow={null}
            />
          ),
          edit: (props) => (
            <AddConvention
              key={`convention-edit-${currentRow?.id_convention}`}
              open={props.open}
              onOpenChange={props.onOpenChange}
              currentRow={props.currentRow as Convention}
            />
          ),
          delete: (props) => (
            <GenericDeleteDialog<Convention>
              key={`convention-delete-${currentRow?.id_convention}`}
              {...props}
              currentRow={props.currentRow as Convention}
              entityName='la convention'
              getEntityLabel={(row) =>
                `${row.code_convention} - ${row.intutile_conv}`
              }
              onDelete={(row) =>
                deleteMutation.mutate(row.id_convention ?? 0)
              }
            />
          ),
        }}
      />
    </div>
  )
}
