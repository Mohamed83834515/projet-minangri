import { IndicateursTable } from './Components/IndicateursTable'
import { RapportPtbaData } from './types'

export function IndicateursPtbaReport({ ptbas, indicateurs, isLoading }: RapportPtbaData) {
  return (
    <div className='space-y-4'>
      <IndicateursTable ptbas={ptbas} indicateurs={indicateurs} isLoading={isLoading} />
    </div>
  )
}