import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemedPrimaryButton } from '@/Global/Generic/ThemedPrimaryButton'
import type { ObservationPtba, Ptba } from '@/simadou/allTypes'
import ObservationPtbaForm from './ObservationPtbaForm'
import ObservationPtbaList from './ObservationPtbaList'

type ObservationPtbaManagerProps = {
  activite: Ptba
}

export default function ObservationPtbaManager({
  activite,
}: ObservationPtbaManagerProps) {
  const [view, setView] = useState<'list' | 'form'>('list')
  const [editingObservation, setEditingObservation] =
    useState<ObservationPtba | null>(null)

  const handleAdd = () => {
    setEditingObservation(null)
    setView('form')
  }

  const handleEdit = (observation: ObservationPtba) => {
    setEditingObservation(observation)
    setView('form')
  }

  const handleClose = () => {
    setView('list')
    setEditingObservation(null)
  }

  const handleSuccess = () => {
    setView('list')
    setEditingObservation(null)
  }

  if (view === 'form') {
    return (
      <div className='space-y-4'>
        <div className='flex items-center justify-between border-b px-4 py-3'>
          <Button variant='outline' size='sm' onClick={handleClose}>
            ← Retour à la liste
          </Button>
          <span className='text-lg font-semibold'>
            {editingObservation ? 'Modifier' : 'Ajouter'} une observation
          </span>
          <div className='w-24' />
        </div>
        <div className='px-4 pb-4'>
          <ObservationPtbaForm
            activite={activite}
            observation={editingObservation}
            onClose={handleClose}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between border-b px-4 py-3'>
        <h3 className='text-lg font-semibold'>
          Observations — {activite.intitule_activite_ptba}
        </h3>
        <ThemedPrimaryButton onClick={handleAdd} icon={Plus}>
          Ajouter une observation
        </ThemedPrimaryButton>
      </div>
      <div className='px-4 pb-4'>
        <ObservationPtbaList
          activiteCode={activite.code_activite_ptba}
          onEdit={handleEdit}
        />
      </div>
    </div>
  )
}
