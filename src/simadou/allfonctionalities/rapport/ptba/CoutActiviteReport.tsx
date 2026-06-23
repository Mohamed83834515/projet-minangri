import { CoutActiviteTable } from './Components/CoutActiviteTable'
import { RapportPtbaData } from './types'

export function CoutActiviteReport({ ptbas, couts, isLoading, currencyCode }: RapportPtbaData) {
  return (
    <div className='space-y-4'>
      <CoutActiviteTable ptbas={ptbas} couts={couts} isLoading={isLoading} currencyCode={currencyCode} />
    </div>
  )
}