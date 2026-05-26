import { useMemo, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { GenericDialogs } from '@/Global/Generic/Genericdialogs'
import { GenericTable } from '@/Global/Generic/Generictable'
import { GenericDeleteDialog } from '@/Global/Tableaux/GenericDeleteDialog'
import useDialogState from '@/hooks/use-dialog-state'
import { useActiveProgrammeCode } from '@/hooks/use-active-programme'
import { Ptba } from '@/simadou/allTypes'
import { buildPtbasColumns } from '@/simadou/allColonnes/ptbas-columns'
import { useDeletePtba, useGetPtbas } from '@/simadou/allHooks/admin/ptbaHooks'
import { usePtbaVersionSelection } from '@/simadou/allHooks/admin/versionHooks'
import AddPtba from './AddPtba'

const route = getRouteApi('/_authenticated/programmation/ptba/')

function ListePtbas() {
  const codeProgramme = useActiveProgrammeCode()
  const { selectedVersionId, setSelectedVersionId, versionOptions } =
    usePtbaVersionSelection(codeProgramme)

  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data: ptbas = [] } = useGetPtbas()
  const deleteMutation = useDeletePtba()

  const filteredPtbas = useMemo(() => {
    if (!selectedVersionId) return ptbas
    return ptbas.filter(
      (ptba: Ptba) => ptba.version_ptba?.toString() === selectedVersionId
    )
  }, [ptbas, selectedVersionId])

  const [open, setOpen] = useDialogState<'add' | 'edit' | 'delete'>(null)
  const [currentRow, setCurrentRow] = useState<Ptba | null>(null)

  const columns = useMemo(
    () => buildPtbasColumns(setOpen, setCurrentRow),
    [setOpen, setCurrentRow]
  )

  return (
    <>
      <GenericTable<Ptba>
        data={filteredPtbas}
        columns={columns}
        search={search}
        navigate={navigate}
        searchKey='intitule_activite_ptba'
        searchPlaceholder='Filter activities...'
        urlFilterConfig={[
          {
            columnId: 'intitule_activite_ptba',
            searchKey: 'intitule_activite_ptba',
            type: 'string',
          },
        ]}
        facetedFilters={[
          {
            columnId: 'version_ptba',
            title: 'Version PTBA',
            options: versionOptions,
            onValueChange: (value: string | undefined) =>
              setSelectedVersionId(value || null),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        ]}
        initialState={{
          columnVisibility: {
            version_ptba: false,
          },
        }}
      />

      <GenericDialogs<Ptba, 'add' | 'edit' | 'delete'>
        open={open}
        setOpen={setOpen}
        currentRow={currentRow}
        setCurrentRow={setCurrentRow}
        rowRequiredDialogs={['edit', 'delete']}
        dialogMap={{
          edit: (props) => (
            <AddPtba
              key={`ptba-edit-${currentRow?.id_ptba}`}
              open={props.open}
              onOpenChange={props.onOpenChange}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              currentRow={props.currentRow as any}
            />
          ),
          delete: (props) => (
            <GenericDeleteDialog<Ptba>
              key={`ptba-delete-${currentRow?.id_ptba}`}
              {...props}
              currentRow={props.currentRow as Ptba}
              entityName='ptba'
              getEntityLabel={(row) => row.intitule_activite_ptba}
              onDelete={(row) => deleteMutation.mutate(row.id_ptba)}
            />
          ),
        }}
      />
    </>
  )
}

export default ListePtbas
