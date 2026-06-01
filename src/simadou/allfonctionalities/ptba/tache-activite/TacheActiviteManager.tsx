import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import type { Ptba, TacheActivitePtba } from '@/simadou/allTypes'
import {
  suiviPtbaQueryKeys,
} from '@/simadou/allHooks/admin/suiviPtbaHooks'
import {
  ActiviteTabbedSubViewHeader,
  useActiviteTabbedSubView,
} from '../ActiviteTabbedDialogContext'
import { useGetTachesByActivite } from '@/simadou/allHooks/admin/tacheActiviteHooks'
import TacheActiviteForm from './TacheActiviteForm'
import TacheActiviteList from './TacheActiviteList'

type TacheActivitePtbaManagerProps = {
  activite: Ptba
}

export default function TacheActiviteManager({
  activite,
}: TacheActivitePtbaManagerProps) {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<TacheActivitePtba | undefined>()

  useActiviteTabbedSubView(showForm)

  const { data: suivis = [], isLoading } = useGetTachesByActivite(
    activite.id_ptba
  )

  const handleAdd = () => {
    setEditing(undefined)
    setShowForm(true)
  }

  const handleEdit = (row: TacheActivitePtba) => {
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
      queryKey: suiviPtbaQueryKeys.tachesActivite(activite.id_ptba),
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
              sectionLabel="Observation globale sur l'activité"
              className='-mt-2 border-0 px-6'
            />
            <div className='p-6 pt-2'>
              <TacheActiviteForm
                tache={editing}
                activite={activite}
                onClose={handleCloseForm}
                onSuccess={handleSuccess}
              />
            </div>
          </div>
        ) : (
          <div className='p-6'>
            <TacheActiviteList
              taches={suivis}
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
          </div>
        </div>
      )}
    </>
  )
}
