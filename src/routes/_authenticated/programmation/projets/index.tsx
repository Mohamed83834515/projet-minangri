import { PageRouteLayout } from '@/Global/HookRoute/genericRoute'
import AddProjet from '@/simadou/allfonctionalities/projets/AddProjet'
import ListeProjets from '@/simadou/allfonctionalities/projets/ListeProjets'
import { createFileRoute } from '@tanstack/react-router'
import { FolderOpen } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/programmation/projets/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageRouteLayout
      title='Gestion des projets'
      boutonAddTitle='Ajouter un projet'
      icon={FolderOpen}
      addDialogComponent={AddProjet}
      listComponent={ListeProjets}
    />
  )
}
