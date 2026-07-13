import {
  DetailField,
  DetailFieldGrid,
  DetailHighlight,
  DetailSection,
} from '@/Global/Detail/DetailFields'
import type { ContratPerformance } from '@/simadou/allTypes/contratPerformance'

export default function ContratOverviewPanel({ contrat }: { contrat: ContratPerformance }) {
  return (
    <div className='space-y-4'>
      <DetailHighlight label='Résumé du contrat'>
        <div className='space-y-1'>
          <p className='font-medium'>{contrat.intitule_contrat}</p>
          <p className='text-sm text-muted-foreground'>
            {contrat.code_contrat} • {contrat.statut}
          </p>
        </div>
      </DetailHighlight>

      <DetailSection title='Informations générales'>
        <DetailFieldGrid>
          <DetailField label='Code' value={contrat.code_contrat} />
          <DetailField label='Intitulé' value={contrat.intitule_contrat} />
          <DetailField label='Statut' value={contrat.statut} />
          <DetailField label='Date de signature' value={contrat.date_signature} />
          <DetailField label='Date de début' value={contrat.date_debut} />
          <DetailField label='Date de fin' value={contrat.date_fin} />
          <DetailField label='Signataire' value={contrat.signataire_ministere} />
          <DetailField label='Note globale' value={contrat.note_globale} />
          <DetailField label='Appréciation' value={contrat.appreciation} />
          <DetailField label='Observation globale' value={contrat.observation_globale} />
          <DetailField label='État' value={contrat.etat ? 'Actif' : 'Inactif'} />
        </DetailFieldGrid>
      </DetailSection>
    </div>
  )
}
