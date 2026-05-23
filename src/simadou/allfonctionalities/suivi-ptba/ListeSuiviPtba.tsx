import { useEffect, useMemo, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { GenericTable } from '@/Global/Generic/Generictable'
import { DIALOG_SIZES } from '@/Global/Forms/dialog'
import type { Ptba, VersionPtba } from '@/simadou/allTypes'
import { buildSuiviPtbaColumns } from '@/simadou/allColonnes/suivi-ptba-columns'
import {
  findDefaultVersionForProgramme,
  isVersionForProgramme,
  PROGRAMME_CODE_PTBA,
} from '@/simadou/constants/programmation'
import { useGetPtbas } from '@/simadou/allHooks/admin/ptbaHooks'
import { useGetVersions } from '@/simadou/allHooks/admin/versionHooks'
import { useSuiviPtbaActivitesProgress } from '@/simadou/allHooks/admin/suiviPtbaHooks'
import ActiviteTabbedDialog from './ActiviteTabbedDialog'
import ObservationPtbaManager from './observations/ObservationPtbaManager'
import SuiviAvancementContratManager from './suivi-avancement-contrat/SuiviAvancementContratManager'
import SuiviIndicateurManager from './suivi-indicateur/SuiviIndicateurManager'
import SuiviTacheActiviteManager from './suivi-tache/SuiviTacheActiviteManager'

const route = getRouteApi('/_authenticated/programmation/suivi-ptba/')

export default function ListeSuiviPtba() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    null
  )
  const [suiviActivite, setSuiviActivite] = useState<Ptba | null>(null)
  const [showSuiviModal, setShowSuiviModal] = useState(false)
  const [showObservationModal, setShowObservationModal] = useState(false)
  const [observationActivite, setObservationActivite] = useState<Ptba | null>(
    null
  )

  const { data: ptbas = [] } = useGetPtbas()
  const { data: versions = [] } = useGetVersions()

  const defaultVersion = useMemo(
    () => findDefaultVersionForProgramme(versions),
    [versions]
  )

  useEffect(() => {
    if (defaultVersion && !selectedVersionId) {
      setSelectedVersionId(defaultVersion.id_version_ptba.toString())
    }
  }, [defaultVersion, selectedVersionId])

  const versionOptions = versions
    .filter((version: VersionPtba) =>
      isVersionForProgramme(version, PROGRAMME_CODE_PTBA)
    )
    .map((version: VersionPtba) => ({
      label: `${version.version_ptba || `Version ${version.id_version_ptba}`} - ${version.annee_ptba}`,
      value: version.id_version_ptba.toString(),
    }))

  const filteredPtbas = useMemo(() => {
    if (!selectedVersionId) return ptbas
    return ptbas.filter(
      (ptba: Ptba) => ptba.version_ptba?.toString() === selectedVersionId
    )
  }, [ptbas, selectedVersionId])

  const activiteIds = useMemo(
    () =>
      filteredPtbas
        .map((a) => a.id_ptba)
        .filter((id): id is number => Number.isFinite(id)),
    [filteredPtbas]
  )

  const {
    tachesByActivite,
    avancementByActivite,
    isLoading: progressLoading,
  } = useSuiviPtbaActivitesProgress(activiteIds)

  const columns = useMemo(
    () =>
      buildSuiviPtbaColumns({
        onOpenSuivi: (activite) => {
          setSuiviActivite(activite)
          setShowSuiviModal(true)
        },
        onOpenObservations: (activite) => {
          setObservationActivite(activite)
          setShowObservationModal(true)
        },
        tachesByActivite,
        avancementByActivite,
        progressLoading,
      }),
    [
      tachesByActivite,
      avancementByActivite,
      progressLoading,
    ]
  )

  return (
    <>
      <GenericTable<Ptba>
        data={filteredPtbas}
        columns={columns}
        search={search}
        navigate={navigate}
        searchKey='intitule_activite_ptba'
        searchPlaceholder='Filtrer les activités...'
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

      <ActiviteTabbedDialog
        activite={suiviActivite}
        open={showSuiviModal}
        onOpenChange={(open) => {
          setShowSuiviModal(open)
          if (!open) setSuiviActivite(null)
        }}
        defaultTab='taches'
        tabs={
          suiviActivite
            ? [
                {
                  value: 'taches',
                  label: 'Suivi des tâches',
                  content: (
                    <SuiviTacheActiviteManager activite={suiviActivite} />
                  ),
                },
                {
                  value: 'indicateurs',
                  label: 'Suivi des indicateurs',
                  content: (
                    <SuiviIndicateurManager activite={suiviActivite} />
                  ),
                },
                {
                  value: 'avancement-contrat',
                  label: "Observation globale sur l'activité",
                  content: (
                    <SuiviAvancementContratManager activite={suiviActivite} />
                  ),
                },
              ]
            : []
        }
      />

      <Dialog
        open={showObservationModal}
        onOpenChange={(open) => {
          setShowObservationModal(open)
          if (!open) setObservationActivite(null)
        }}
      >
        <DialogContent className={DIALOG_SIZES.lg}>
          <DialogHeader>
            <DialogTitle>Observations</DialogTitle>
          </DialogHeader>
          {observationActivite && (
            <ObservationPtbaManager activite={observationActivite} />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
