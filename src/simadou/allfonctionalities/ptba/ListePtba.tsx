import { useState, useMemo, useEffect } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { GenericDialogs } from '@/Global/Generic/Genericdialogs'
import { GenericTable } from '@/Global/Generic/Generictable'
import { GenericDeleteDialog } from '@/Global/Tableaux/GenericDeleteDialog'
import { toast } from 'sonner'
import useDialogState from '@/hooks/use-dialog-state'
import { Ptba, VersionPtba } from '@/simadou/allTypes'
import { buildPtbasColumns } from '@/simadou/allColonnes/ptbas-columns'
import { PROGRAMME_CODE_PTBA } from '@/simadou/constants/programmation'
import { useGetPtbas } from '@/simadou/allHooks/admin/ptbaHooks'
import { useGetVersions } from '@/simadou/allHooks/admin/versionHooks'
import SelectInput from 'react-select'
const route = getRouteApi('/_authenticated/programmation/ptba/')

function ListePtbas() {
  // État local pour la version sélectionnée
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null)

  const search = route.useSearch()
  const navigate = route.useNavigate()

  // Listes des ptbas et des versions pour les filtres et affichages
  const { data: ptbas = [] } = useGetPtbas()
  const { data: versions = [] } = useGetVersions()

  // Récupérer l'année courante
  const currentYear = new Date().getFullYear()
  const defaultVersion = versions.find((v: any) => v.annee_ptba === currentYear)

  // Initialiser la version sélectionnée avec l'année courante au chargement
  useEffect(() => {
    if (defaultVersion && !selectedVersionId) {
      setSelectedVersionId(defaultVersion.id_version_ptba.toString())
    }
  }, [defaultVersion])

  // Filtrer les ptbas côté client
  const filteredPtbas = useMemo(() => {
    if (!selectedVersionId) return ptbas
    return ptbas.filter((ptba: Ptba) => ptba.version_ptba?.toString() === selectedVersionId)
  }, [ptbas, selectedVersionId])
  // Options pour le filtre
  const versionOptions = versions
  .filter((version: VersionPtba) => typeof version.programme === "object" && version.programme?.code_programme === PROGRAMME_CODE_PTBA)
  .map((version: any) => ({
    label: `${version.version_ptba || `Version ${version.id_version_ptba}`} - ${version.annee_ptba}`,
    value: version.id_version_ptba.toString()
  }))

  const [open, setOpen] = useDialogState<'add' | 'edit' | 'delete'>(
    null
  )
  const [currentRow, setCurrentRow] = useState<Ptba | null>(null)

  const columns = useMemo(
    () => buildPtbasColumns(setOpen, setCurrentRow),
    [setOpen, setCurrentRow]
  )
  console.log('selectedVersionId', selectedVersionId)

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
              setSelectedVersionId(selected?.value || null)
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
          //   edit: (props) => (
          //     <EditUser
          //       key={`user-edit-${currentRow?.id}`}
          //       open={props.open}
          //       onOpenChange={props.onOpenChange}
          //       currentRow={props.currentRow as User}
          //     />
          //   ),
          delete: (props) => (
            <GenericDeleteDialog<Ptba>
              key={`ptba-delete-${currentRow?.id}`}
              {...props}
              currentRow={props.currentRow as Ptba}
              entityName='ptba'
              getEntityLabel={(row) => row.intitule_activite_ptba}
              onDelete={(row) =>
                toast.success(`Ptba ${row.intitule_activite_ptba} supprimé`)
              }
            />
          ),
        }}
      />
    </>
  )
}

export default ListePtbas
