import { useMemo, useState } from 'react'
import { GenericTable } from '@/Global/Generic/Generictable'
import { GenericDialogs } from '@/Global/Generic/Genericdialogs'
import { GenericDeleteDialog } from '@/Global/Tableaux/GenericDeleteDialog'
import { useEmbeddedTableState } from '@/hooks/use-embedded-table-state'
import useDialogState from '@/hooks/use-dialog-state'
import { buildPpmColumns } from '@/simadou/allColonnes/ppm-columns'
import { useGetModesPassation } from '@/simadou/allHooks/admin/modePassationHooks'
import { useGetNaturesMarche } from '@/simadou/allHooks/admin/natureMarcheHooks'
import { useDeletePpm, useGetPpms } from '@/simadou/allHooks/admin/ppmHooks'
import { useGetTypeFinancementPPM } from '@/simadou/allHooks/admin/typeFinancementPPM'
import { useGetVersionsPPM } from '@/simadou/allHooks/admin/versionPPMHooks'
import type { Ppm } from '@/simadou/allTypes/ppm'
import AddPpm from './AddPpm'

export default function ListePpm() {
  const { search, navigate } = useEmbeddedTableState()
  const [open, setOpen] = useDialogState<'add' | 'edit' | 'delete'>(null)
  const [currentRow, setCurrentRow] = useState<Ppm | null>(null)

  const { data = [], isLoading } = useGetPpms()
  const { data: versions = [] } = useGetVersionsPPM()
  const { data: modes = [] } = useGetModesPassation()
  const { data: typesFinancement = [] } = useGetTypeFinancementPPM()
  const { data: natures = [] } = useGetNaturesMarche()
  const deleteMutation = useDeletePpm()

  const lookups = useMemo(
    () => ({
      versionsById: new Map(
        versions
          .filter((v) => v.id_version_ppm != null)
          .map((v) => [v.id_version_ppm!, v])
      ),
      modesById: new Map(modes.map((m) => [m.id_mode_passation, m])),
      typesFinancementById: new Map(
        typesFinancement.map((t) => [t.id_type_financement_ppm, t])
      ),
      naturesById: new Map(natures.map((n) => [n.id_nature_marche, n])),
    }),
    [versions, modes, typesFinancement, natures]
  )

  const columns = useMemo(
    () => buildPpmColumns(setOpen, setCurrentRow, lookups),
    [lookups]
  )

  return (
    <div className='space-y-2'>
      <GenericTable
        data={data}
        columns={columns}
        search={search}
        navigate={navigate}
        isLoading={isLoading}
        searchKey='intitule_ppm'
        searchPlaceholder='Filtrer les PPM...'
        defaultPageSize={10}
        showViewOptions={false}
        emptyMessage='Aucun PPM trouvé.'
      />

      <GenericDialogs<Ppm, 'add' | 'edit' | 'delete'>
        open={open}
        setOpen={setOpen}
        currentRow={currentRow}
        setCurrentRow={setCurrentRow}
        rowRequiredDialogs={['edit', 'delete']}
        dialogMap={{
          add: (props) => (
            <AddPpm
              key='ppm-add'
              open={props.open}
              onOpenChange={props.onOpenChange}
              currentRow={null}
            />
          ),
          edit: (props) => (
            <AddPpm
              key={`ppm-edit-${currentRow?.id_ppm}`}
              open={props.open}
              onOpenChange={props.onOpenChange}
              currentRow={props.currentRow as Ppm}
            />
          ),
          delete: (props) => (
            <GenericDeleteDialog<Ppm>
              key={`ppm-delete-${currentRow?.id_ppm}`}
              {...props}
              currentRow={props.currentRow as Ppm}
              entityName='le PPM'
              getEntityLabel={(row) => row.intitule_ppm}
              onDelete={(row) => deleteMutation.mutate(row.id_ppm ?? 0)}
            />
          ),
        }}
      />
    </div>
  )
}
