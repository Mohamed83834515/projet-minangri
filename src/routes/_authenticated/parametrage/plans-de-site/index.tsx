import { PageRouteLayout } from '@/Global/HookRoute/genericRoute'
import ListePlanSite from '@/simadou/allfonctionalities/parametrage/plan-site/ListePlanSite'
import { createFileRoute } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'

export const Route = createFileRoute(
  '/_authenticated/parametrage/plans-de-site/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageRouteLayout
      title="Plan de Site"
      icon={MapPin}
      showAddButton={false}
      listComponent={ListePlanSite}
    />
  )
}
