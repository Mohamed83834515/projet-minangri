import { useMemo, useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { GenericTable } from '@/Global/Generic/Generictable'
import { DIALOG_SIZES } from '@/Global/Forms/dialog'
import { useEmbeddedTableState } from '@/hooks/use-embedded-table-state'
import type { Projet } from '@/simadou/allTypes'
import type { PtbaProjet } from '@/simadou/allTypes/ptbaProjet'
import { useGetPtbasProjet } from '@/simadou/allHooks/admin/ptbaProjetHooks'
import { useSuiviPtbaProjetActivitesProgress } from '@/simadou/allHooks/admin/suiviPtbaProjetHooks'
import ActiviteTabbedDialog from '@/simadou/allfonctionalities/suivi-ptba/ActiviteTabbedDialog'
import SuiviTacheActiviteProjetManager from './suivi-tache/SuiviTacheActiviteManager'
import SuiviIndicateurProjetManager from './suivi-indicateur/SuiviIndicateurManager'
import SuiviAvancementContratProjetManager from './suivi-avancement-contrat/SuiviAvancementContratManager'
import SuiviDecaissementPtbaProjetManager from './suivi-decaissement/SuiviDecaissementPtbaProjetManager'
import { buildSuiviPtbaProjetColumns } from '@/simadou/allColonnes/suivi-ptba-projet-columns'
import { PtbaVersionSelect } from '@/simadou/allfonctionalities/ptba/PtbaVersionSelect'
import { usePtbaVersionSelection } from '@/simadou/allHooks/admin/versionHooks'
import { useActiveProgrammeCode } from '@/hooks/use-active-programme'

type ProjetSuiviPtbaPanelProps = {
  projet: Projet
}

export default function ProjetSuiviPtbaPanel({ projet }: ProjetSuiviPtbaPanelProps) {
  const codeProjet = projet.code_projet
  const activeProgrammeCode = useActiveProgrammeCode()
  const codeProgramme =
    typeof projet.programme_projet === 'object' &&
      projet.programme_projet?.code_programme
      ? projet.programme_projet.code_programme
      : activeProgrammeCode

  const { search, navigate } = useEmbeddedTableState()
  const { data: ptbas = [] } = useGetPtbasProjet(codeProjet)

  // 📌 Filtre par version (année)
  const { selectedVersionId, handleChangeVersion, versionOptions } =
    usePtbaVersionSelection(codeProgramme)

  const [suiviActivite, setSuiviActivite] = useState<PtbaProjet | null>(null)
  const [showSuiviModal, setShowSuiviModal] = useState(false)
  const [showObservationModal, setShowObservationModal] = useState(false)
  const [observationActivite, setObservationActivite] =
    useState<PtbaProjet | null>(null)

  // ✅ Calculer les années de la durée du projet
  const projectYears = useMemo(() => {
    if (!projet.date_demarrage_projet || !projet.duree_projet) {
      return []
    }

    const startDate = new Date(projet.date_demarrage_projet)
    const startYear = startDate.getFullYear()
    const durationInMonths = projet.duree_projet
    const durationInYears = Math.ceil(durationInMonths / 12)
    
    return Array.from({ length: durationInYears }, (_, i) => startYear + i)
  }, [projet.date_demarrage_projet, projet.duree_projet])

  // ✅ Filtrer les versionOptions par durée du projet
  const filteredVersionOptions = useMemo(() => {
    const years = new Set(projectYears)
    
    return versionOptions.filter((option) => {
      // ✅ Extraire l'année du label (ex: "2025" ou "Version 2025")
      const yearMatch = option.label.match(/\d{4}/)
      if (!yearMatch) return false
      const year = Number(yearMatch[0])
      return years.has(year)
    })
  }, [versionOptions, projectYears])

  // ✅ Mettre à jour selectedVersionId si la version sélectionnée n'est plus valide
  useEffect(() => {
    if (filteredVersionOptions.length === 0) return
    
    const isSelectedValid = filteredVersionOptions.some(
      (opt) => opt.value === selectedVersionId
    )
    
    if (!isSelectedValid) {
      handleChangeVersion(filteredVersionOptions[0].value)
    }
  }, [filteredVersionOptions, selectedVersionId, handleChangeVersion])

  // 📌 Filtrer les PTBA par version (année) sélectionnée
  const filteredPtbas = useMemo(() => {
    if (!selectedVersionId) return ptbas
    return ptbas.filter(
      (ptba) => ptba.version_ptba?.toString() === selectedVersionId
    )
  }, [ptbas, selectedVersionId])

  // 📌 Extraire les IDs des activités filtrées
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
  } = useSuiviPtbaProjetActivitesProgress(activiteIds)

  const columns = useMemo(
    () =>
      buildSuiviPtbaProjetColumns({
        onOpenSuivi: (activite) => {
          setSuiviActivite(activite as PtbaProjet)
          setShowSuiviModal(true)
        },
        onOpenObservations: (activite) => {
          setObservationActivite(activite as PtbaProjet)
          setShowObservationModal(true)
        },
        tachesByActivite,
        avancementByActivite,
        progressLoading,
      }),
    [tachesByActivite, avancementByActivite, progressLoading]
  )

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <p className='text-sm text-muted-foreground'>
          Suivi d&apos;avancement des activités PTBA rattachées à ce projet.
        </p>
        {/* 📌 Sélecteur de version (année) filtré */}
        {filteredVersionOptions.length > 0 ? (
          <PtbaVersionSelect
            options={filteredVersionOptions}
            value={selectedVersionId}
            onChange={handleChangeVersion}
          />
        ) : null}
      </div>

      <GenericTable<PtbaProjet>
        data={filteredPtbas}  
        columns={columns}
        search={search}
        navigate={navigate}
        searchKey='intitule_activite_ptba'
        searchPlaceholder='Filtrer les activités…'
        urlFilterConfig={[
          {
            columnId: 'intitule_activite_ptba',
            searchKey: 'intitule_activite_ptba',
            type: 'string',
          },
        ]}
        showViewOptions={false}
        emptyMessage='Aucune activité PTBA à suivre pour ce projet.'
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
                    <SuiviTacheActiviteProjetManager activite={suiviActivite} />
                  ),
                },
                {
                  value: 'indicateurs',
                  label: 'Suivi des indicateurs',
                  content: (
                    <SuiviIndicateurProjetManager activite={suiviActivite} />
                  ),
                },
                {
                  value: 'decaissement',
                  label: 'Suivi décaissement',
                  content: (
                    <SuiviDecaissementPtbaProjetManager
                      key={suiviActivite.id_ptba}
                      projet={projet}
                      activite={suiviActivite}
                    />
                  ),
                },
                {
                  value: 'avancement-contrat',
                  label: "Observation globale sur l'activité",
                  content: (
                    <SuiviAvancementContratProjetManager
                      key={suiviActivite.id_ptba}
                      activite={suiviActivite}
                    />
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
        <DialogContent
          className={`${DIALOG_SIZES.lg} flex max-h-[90vh] flex-col overflow-hidden`}
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle>Observations</DialogTitle>
          </DialogHeader>
          {observationActivite && (
            <div className='min-h-0 flex-1 overflow-hidden'>
              <SuiviAvancementContratProjetManager
                key={observationActivite.id_ptba}
                activite={observationActivite}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}