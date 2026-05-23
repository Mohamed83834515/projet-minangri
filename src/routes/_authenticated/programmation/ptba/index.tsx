import { PageRouteLayout } from '@/Global/HookRoute/genericRoute'
import AddPtba from '@/simadou/allfonctionalities/ptba/AddPtba'
import ListePtbas from '@/simadou/allfonctionalities/ptba/ListePtba'
import { createFileRoute } from '@tanstack/react-router'
import { ClipboardList } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/programmation/ptba/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageRouteLayout
      title="Listes activités PTBA"
      boutonAddTitle="Ajouter Ptba"
      icon={ClipboardList}
      addDialogComponent={AddPtba}
      listComponent={ListePtbas}
    />
  )
}
