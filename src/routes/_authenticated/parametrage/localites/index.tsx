 
import { createFileRoute } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'
import { PageRouteLayout } from '@/Global/HookRoute/genericRoute'
import ListeLocalite from '@/simadou/allfonctionalities/parametrage/localite/ListeLocalite'

export const Route = createFileRoute('/_authenticated/parametrage/localites/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageRouteLayout
      title="Localités"
      icon={MapPin}
      showAddButton={false}
      listComponent={ListeLocalite}
    />
  )
}