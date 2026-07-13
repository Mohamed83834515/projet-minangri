import { DetailSection } from '@/Global/Detail/DetailFields'
import type { ContratPerformance } from '@/simadou/allTypes/contratPerformance'

export default function ContratIndicatorsPanel({ contrat }: { contrat: ContratPerformance }) {
  return (
    <DetailSection title='Indicateurs de résultats'>
      <div className='rounded-lg border bg-muted/20 p-4 text-sm text-muted-foreground'>
        Les indicateurs de résultats associés au contrat apparaîtront ici. {contrat.code_contrat}
      </div>
    </DetailSection>
  )
}
