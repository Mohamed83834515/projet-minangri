import { DetailSection } from '@/Global/Detail/DetailFields'
import type { ContratPerformance } from '@/simadou/allTypes/contratPerformance'

export default function ContratResultsFrameworkPanel({ contrat }: { contrat: ContratPerformance }) {
  return (
    <DetailSection title='Cadre de résultat'>
      <div className='rounded-lg border bg-muted/20 p-4 text-sm text-muted-foreground'>
        Le cadre de résultat du contrat sera affiché ici. {contrat.code_contrat}
      </div>
    </DetailSection>
  )
}
