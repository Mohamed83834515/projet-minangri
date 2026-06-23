import { TachesTable } from './Components/TachesTable'
import { RapportPtbaData } from './types'

export function TachesPtbaReport({ ptbas, taches, isLoading }: RapportPtbaData) {
  return (
    <div className='space-y-4'>
      <TachesTable ptbas={ptbas} taches={taches} isLoading={isLoading} />
    </div>
  )
}