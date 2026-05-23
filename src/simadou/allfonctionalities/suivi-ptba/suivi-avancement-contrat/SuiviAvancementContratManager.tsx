import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import type { Ptba, SuiviAvancementContrat } from '@/simadou/allTypes'
import {
  suiviPtbaQueryKeys,
  useGetSuiviAvancementByActivite,
} from '@/simadou/allHooks/admin/suiviPtbaHooks'
import {
  ActiviteTabbedSubViewHeader,
  useActiviteTabbedSubView,
} from '../ActiviteTabbedDialogContext'
import SuiviAvancementContratForm from './SuiviAvancementContratForm'
import SuiviAvancementContratList from './SuiviAvancementContratList'

type SuiviAvancementContratManagerProps = {
  activite: Ptba
}

export default function SuiviAvancementContratManager({
  activite,
}: SuiviAvancementContratManagerProps) {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<SuiviAvancementContrat | undefined>()

  useActiviteTabbedSubView(showForm)

  const { data: suivis = [], isLoading } = useGetSuiviAvancementByActivite(
    activite.id_ptba
  )

  const handleAdd = () => {
    setEditing(undefined)
    setShowForm(true)
  }

  const handleEdit = (row: SuiviAvancementContrat) => {
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
      queryKey: suiviPtbaQueryKeys.suiviAvancement(activite.id_ptba),
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
              <SuiviAvancementContratForm
                suivi={editing}
                activite={activite}
                onClose={handleCloseForm}
                onSuccess={handleSuccess}
              />
            </div>
          </div>
        ) : (
          <div className='p-6'>
            <SuiviAvancementContratList
              suivis={suivis}
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
            <div className='text-xs text-muted-foreground'>
              {suivis.length} observation(s) globale(s)
            </div>
          </div>
        </div>
      )}
    </>
  )
}
