import { ListChecks } from 'lucide-react'
import RapportPageLayout from '../RapportPageLayout'
import ListeRapportEtatActivites from './ListeRapportEtatActivites'

export default function RapportEtatActivitesPage() {
  return (
    <RapportPageLayout title='État des activités' icon={ListChecks}>
      <ListeRapportEtatActivites />
    </RapportPageLayout>
  )
}
