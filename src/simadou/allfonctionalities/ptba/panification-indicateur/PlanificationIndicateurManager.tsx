import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, Plus } from 'lucide-react'
import { ThemedPrimaryButton } from '@/Global/Generic/ThemedPrimaryButton'
import type {
  IndicateurActivitePtba,
  Ptba,
  SuiviIndicateurActivite,
} from '@/simadou/allTypes'
import {
  suiviPtbaQueryKeys,
  useGetAllSuivisIndicateurs,
  useGetIndicateursByActivite,
} from '@/simadou/allHooks/admin/suiviPtbaHooks'
import {
  ActiviteTabbedSubViewHeader,
  useActiviteTabbedSubView,
} from '../ActiviteTabbedDialogContext'
import SuiviIndicateurForm from './PlanificationIndicateurForm'
import SuiviIndicateurList from './PlanificationIndicateurList'

type SuiviIndicateurManagerProps = {
  activite: Ptba
}

export default function SuiviIndicateurManager({
  activite,
}: SuiviIndicateurManagerProps) {
  const queryClient = useQueryClient()
  const [view, setView] = useState<'list' | 'suivi-form'>('list')
  const [selectedIndicateur, setSelectedIndicateur] =
    useState<IndicateurActivitePtba | null>(null)
  const [editingSuivi, setEditingSuivi] =
    useState<SuiviIndicateurActivite | null>(null)

  useActiviteTabbedSubView(view === 'suivi-form')

  const { data: indicateurs = [], isLoading } = useGetIndicateursByActivite(
    activite.code_activite_ptba
  )
  const { data: suivis = [] } = useGetAllSuivisIndicateurs(
    !!activite.code_activite_ptba
  )

  const handleAddSuivi = (indicateur: IndicateurActivitePtba) => {
    setSelectedIndicateur(indicateur)
    setEditingSuivi(null)
    setView('suivi-form')
  }

  const handleEditSuivi = (suivi: SuiviIndicateurActivite) => {
    const codeIndicateur =
      typeof suivi.indicateur_activite === 'object' && suivi.indicateur_activite
        ? suivi.indicateur_activite.code_indicateur_activite
        : suivi.indicateur_activite

    const indicateur = indicateurs.find(
      (ind) => ind.code_indicateur_activite === codeIndicateur
    )

    if (indicateur) {
      setSelectedIndicateur(indicateur)
      setEditingSuivi(suivi)
      setView('suivi-form')
    }
  }

  const handleCloseSuiviForm = () => {
    setView('list')
    setSelectedIndicateur(null)
    setEditingSuivi(null)
  }

  const handleSuiviFormSuccess = () => {
    handleCloseSuiviForm()
    queryClient.invalidateQueries({
      queryKey: suiviPtbaQueryKeys.suivisIndicateurs,
    })
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (view === 'suivi-form' && selectedIndicateur) {
    return (
      <div className='space-y-4 p-4'>
        <ActiviteTabbedSubViewHeader sectionLabel='Suivi des indicateurs' />
        <SuiviIndicateurForm
          indicateur={selectedIndicateur}
          suivi={editingSuivi}
          onClose={handleCloseSuiviForm}
          onSuccess={handleSuiviFormSuccess}
        />
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='border-b px-4 py-3'>
        <span className='text-lg font-semibold'>Suivi des indicateurs</span>
      </div>

      <div className='space-y-4 p-4'>
        {indicateurs.length === 0 ? (
          <div className='rounded-lg bg-muted/50 py-8 text-center text-muted-foreground'>
            <p className='font-medium'>Aucun indicateur pour cette activité</p>
            <p className='mt-2 text-sm'>
              Les indicateurs doivent être créés dans la section Programmation.
            </p>
          </div>
        ) : (
          indicateurs.map((indicateur) => (
            <div
              key={indicateur.id_indicateur_activite}
              className='space-y-2 rounded-lg border p-3'
            >
              <div className='flex items-center justify-between gap-2 rounded-md bg-muted/60 px-4 py-2'>
                <div className='min-w-0 flex-1'>
                  <span className='font-medium'>
                    {indicateur.intitule_indicateur_tache}
                  </span>
                  <span className='ml-2 text-sm text-muted-foreground'>
                    (
                    {typeof indicateur.abrege_unite === 'object'
                      ? indicateur.abrege_unite?.unite_ui
                      : 'Unité'}
                    )
                  </span>
                  <span className='ml-2 text-xs text-muted-foreground'>
                    Code: {indicateur.code_indicateur_activite}
                  </span>
                </div>
                <ThemedPrimaryButton
                  onClick={() => handleAddSuivi(indicateur)}
                  icon={Plus}
                  className='h-8 px-3 text-sm'
                >
                  Ajouter un suivi
                </ThemedPrimaryButton>
              </div>

              <SuiviIndicateurList
                suivis={suivis.filter(
                  (s) =>
                    (typeof s.indicateur_activite === 'string' &&
                      s.indicateur_activite ===
                        indicateur.code_indicateur_activite) ||
                    (typeof s.indicateur_activite === 'object' &&
                      s.indicateur_activite?.code_indicateur_activite ===
                        indicateur.code_indicateur_activite)
                )}
                onEdit={handleEditSuivi}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
