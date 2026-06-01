// simadou/components/suivi/IndicateurTacheManager.tsx
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import type { Ptba } from '@/simadou/allTypes'
import { suiviPtbaQueryKeys } from '@/simadou/allHooks/admin/indicateurTacheHooks'
import {
  ActiviteTabbedSubViewHeader,
  useActiviteTabbedSubView,
} from '../ActiviteTabbedDialogContext'
import { useGetIndicateursByActivite } from '@/simadou/allHooks/admin/indicateurTacheHooks'
import IndicateurTacheForm from './IndicateurTacheForm'
import { IndicateurTache } from '@/simadou/allTypes/indicateurTache'
import IndicateurTacheList from './IndicateurTacheList'

type IndicateurTacheManagerProps = {
  activite: Ptba
}

export default function IndicateurTacheManager({
  activite,
}: IndicateurTacheManagerProps) {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<IndicateurTache | undefined>()

  useActiviteTabbedSubView(showForm)

  const { data: indicateurs = [], isLoading } = useGetIndicateursByActivite(
    activite.id_ptba
  )

  const handleAdd = () => {
    setEditing(undefined)
    setShowForm(true)
  }

  const handleEdit = (row: IndicateurTache) => {
    setEditing(row)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditing(undefined)
  }

  const handleSuccess = () => {
    setShowForm(false)
    setEditing(undefined)
    queryClient.invalidateQueries({
      queryKey: suiviPtbaQueryKeys.indicateurs(activite.id_ptba),
    })
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  return (
    <>
      <div className='flex-1 overflow-y-auto'>
        {showForm ? (
          <div>
            <ActiviteTabbedSubViewHeader
              sectionLabel="Indicateurs de l'activité"
              className='-mt-2 border-0 px-6'
            />
            <div className='p-6 pt-2'>
              <IndicateurTacheForm
                indicateur={editing}
                activite={activite}
                onClose={handleCloseForm}
                onSuccess={handleSuccess}
              />
            </div>
          </div>
        ) : (
          <div className='p-6'>
            <IndicateurTacheList
              indicateurs={indicateurs}
              idActivite={activite.id_ptba}
              onEdit={handleEdit}
              onAdd={handleAdd}
            />
          </div>
        )}
      </div>

      {!showForm && (
        <div className='border-t bg-muted/40 px-6 py-4 text-sm'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div>
              <span className='font-medium'>Activité :</span>{' '}
              {activite.code_activite_ptba} — {activite.intitule_activite_ptba}
            </div>
            <div>
              <span className='font-medium'>Total indicateurs :</span>{' '}
              {indicateurs.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
}