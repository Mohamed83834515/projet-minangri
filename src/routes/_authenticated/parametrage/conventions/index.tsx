import { PageRouteLayout } from '@/Global/HookRoute/genericRoute'
import AddConvention from '@/simadou/allfonctionalities/parametrage/convention/AddConvention'
import ListeConvention from '@/simadou/allfonctionalities/parametrage/convention/ListeConvention'
import { createFileRoute } from '@tanstack/react-router'
import { FileSignature } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/parametrage/conventions/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageRouteLayout
      title='Conventions'
      icon={FileSignature}
      boutonAddTitle='Ajouter une convention'
      addDialogComponent={AddConvention}
      listComponent={ListeConvention}
    />
  )
}
