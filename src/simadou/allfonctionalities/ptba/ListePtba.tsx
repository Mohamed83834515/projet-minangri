import { useMemo, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { GenericDialogs } from '@/Global/Generic/Genericdialogs'
import { GenericTable } from '@/Global/Generic/Generictable'
import { GenericDeleteDialog } from '@/Global/Tableaux/GenericDeleteDialog'
import { toast } from 'sonner'
import useDialogState from '@/hooks/use-dialog-state'
import { Ptba } from '@/simadou/allTypes'
import { buildPtbasColumns } from '@/simadou/allColonnes/ptbas-columns'
import { useActiveProgrammeCode } from '@/hooks/use-active-project'
import { useGetPtbas } from '@/simadou/allHooks/admin/ptbaHooks'
import { usePtbaVersionSelection } from '@/simadou/allHooks/admin/versionHooks'
const route = getRouteApi('/_authenticated/programmation/ptba/')

function ListePtbas() {
  const codeProgramme = useActiveProgrammeCode()
  const { selectedVersionId, setSelectedVersionId, versionOptions } =
    usePtbaVersionSelection(codeProgramme)

  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data: ptbas = [] } = useGetPtbas()
  const { data: versions = [] } = useGetVersions()
  const deleteMutation = useDeletePtba()


  // Récupérer l'année courante
  const currentYear = new Date().getFullYear()
  const defaultVersion = versions.find((v: any) => v.annee_ptba === currentYear)

  // Initialiser la version sélectionnée avec l'année courante au chargement
  useEffect(() => {
    if (defaultVersion && !selectedVersionId) {
      setSelectedVersionId(defaultVersion.id_version_ptba.toString())
      localStorage.setItem('selectedVersionId', defaultVersion.id_version_ptba.toString())
    }
  }, [defaultVersion])

  // Gérer le changement de version pour filtrer les ptbas
  const handleChangeVersion = (versionId: string | null) => {
    setSelectedVersionId(versionId)
    if (versionId) {
      localStorage.setItem('selectedVersionId', versionId)
    } else {
      localStorage.removeItem('selectedVersionId')
    }
  }
  // Filtrer les ptbas côté client
  const filteredPtbas = useMemo(() => {
    if (!selectedVersionId) return ptbas
    return ptbas.filter(
      (ptba: Ptba) => ptba.version_ptba?.toString() === selectedVersionId
    )
  }, [ptbas, selectedVersionId])

  const [open, setOpen] = useDialogState<'add' | 'edit' | 'delete'>(
    null
  )
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
        toolbarEndSlot={
          <SelectInput<{ label: string; value: string }>
            placeholder="Rechercher une version..."
            options={versionOptions}
            value={
              versionOptions.find((opt) => opt.value === selectedVersionId) || null
            }
            onChange={(selected: any) =>
              handleChangeVersion(selected?.value || null)
            }
            isClearable
          />
        }
        urlFilterConfig={[
          { columnId: 'intitule_activite_ptba', searchKey: 'intitule_activite_ptba', type: 'string' }
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
                key={`user-edit-${currentRow?.id}`}
                open={props.open}
                onOpenChange={props.onOpenChange}
                currentRow={props.currentRow as any}
              />
            ),
          delete: (props) => (
            <GenericDeleteDialog<Ptba>
              key={`ptba-delete-${currentRow?.id}`}
              {...props}
              currentRow={props.currentRow as Ptba}
              entityName='ptba'
              getEntityLabel={(row) => row.intitule_activite_ptba}
              onDelete={(row) =>
                deleteMutation.mutate(row.id_ptba)
              }
            />
          ),
        }}
      />
    </>
  )
}

export default ListePtbas
