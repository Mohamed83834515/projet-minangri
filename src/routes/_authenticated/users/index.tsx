import { PageRouteLayout } from '@/Global/HookRoute/genericRoute'
import AddUser from '@/simadou/allfonctionalities/users/AddUser'
import ListeUsers from '@/simadou/allfonctionalities/users/ListeUsers'
import { createFileRoute } from '@tanstack/react-router'
import { Users } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageRouteLayout
      title="Listes utilisateurs"
      icon={Users}
      addDialogComponent={AddUser}
      listComponent={ListeUsers}
    />
  )
}