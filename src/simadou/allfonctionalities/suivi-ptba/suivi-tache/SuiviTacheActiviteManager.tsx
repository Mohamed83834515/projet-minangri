import { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import type { Ptba, SuiviTacheActivite, TacheActivitePtba } from '@/simadou/allTypes'
import { tacheBelongsToActivite } from '@/simadou/allTypes/tacheActivitePtba'
import { tauxAvancementGlobalTaches } from '@/simadou/allTypes/suiviTacheActivite'
import {
  suiviPtbaQueryKeys,
  useGetSuiviTachesByActivite,
  useGetTachesByActivite,
} from '@/simadou/allHooks/admin/suiviPtbaHooks'
import {
  ActiviteTabbedSubViewHeader,
  useActiviteTabbedSubView,
} from '../ActiviteTabbedDialogContext'
import TacheAvancementProgressBar from '../TacheAvancementProgressBar'
import SuiviTacheActiviteForm from './SuiviTacheActiviteForm'
import SuiviTacheActiviteList from './SuiviTacheActiviteList'

type SuiviTacheActiviteManagerProps = {
  activite: Ptba
}

export default function SuiviTacheActiviteManager({
  activite,
}: SuiviTacheActiviteManagerProps) {
  const queryClient = useQueryClient()
  const [selectedTache, setSelectedTache] = useState<TacheActivitePtba | null>(
    null
  )
  const [editingSuivi, setEditingSuivi] = useState<
    SuiviTacheActivite | undefined
  >()

  const showForm = selectedTache != null
  useActiviteTabbedSubView(showForm)

  const { data: suivis = [], isLoading: suivisLoading } =
    useGetSuiviTachesByActivite(activite.id_ptba)
  const { data: taches = [], isLoading: tachesLoading } = useGetTachesByActivite(
    activite.id_ptba
  )

  const filteredTaches = useMemo(
    () => taches.filter((t) => tacheBelongsToActivite(t, activite)),
    [taches, activite]
  )

  const tauxAvancementGlobal = useMemo(
    () => tauxAvancementGlobalTaches(filteredTaches, suivis),
    [filteredTaches, suivis]
  )

  const handleSuivre = (
    tache: TacheActivitePtba,
    suivi?: SuiviTacheActivite
  ) => {
    setSelectedTache(tache)
    setEditingSuivi(suivi)
  }

  const handleCloseForm = () => {
    setSelectedTache(null)
    setEditingSuivi(undefined)
  }

  const handleSuccess = () => {
    handleCloseForm()
    queryClient.invalidateQueries({
      queryKey: suiviPtbaQueryKeys.suiviTache(activite.id_ptba),
    })
    queryClient.invalidateQueries({ queryKey: suiviPtbaQueryKeys.tachesAll })
  }

  const isLoading = suivisLoading || tachesLoading

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
        {showForm && selectedTache ? (
          <div className='px-6 pb-6 pt-2'>
            <ActiviteTabbedSubViewHeader
              sectionLabel={`Suivi — ${selectedTache.intutile_tache_gt}`}
              className='-mt-2 mb-4 border-0 px-0'
            />
            <SuiviTacheActiviteForm
              tache={selectedTache}
              suivi={editingSuivi}
              idActivite={activite.id_ptba}
              onClose={handleCloseForm}
              onSuccess={handleSuccess}
            />
          </div>
        ) : (
          <div className='px-6 py-5'>
            <SuiviTacheActiviteList
              taches={filteredTaches}
              suivis={suivis}
              onSuivre={handleSuivre}
            />
          </div>
        )}
      </div>

      {!showForm && (
        <div className='border-t bg-muted/40 px-6 py-5 text-sm'>
          <div className='flex flex-wrap items-center justify-between gap-6'>
            <TacheAvancementProgressBar percent={tauxAvancementGlobal} />
            <div className='shrink-0 text-xs text-muted-foreground'>
              {filteredTaches.length} tâche(s) · {suivis.length} suivi(s)
            </div>
          </div>
        </div>
      )}
    </>
  )
}
