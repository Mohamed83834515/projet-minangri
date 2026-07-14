import RapportContratPerformancePage from '@/simadou/allfonctionalities/rapport/contrat-performance/RapportContratPerformancePage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/rapport/contrat-performance/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RapportContratPerformancePage />
}
