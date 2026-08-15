import { PageRouteLayout } from '@/Global/HookRoute/genericRoute'
import ListeUtilisateurs from '@/simadou/allfonctionalities/parametrage/utilisateurs/ListeUtilisateurs'
import UtilisateurDialog from '@/simadou/allfonctionalities/parametrage/utilisateurs/UtilisateurDialog'
import { createFileRoute } from '@tanstack/react-router'
import { Users } from 'lucide-react'

export const Route = createFileRoute(
    '/_authenticated/parametrage/utilisateurs/',
)({
    component: RouteComponent,
})
function RouteComponent() {
    return (
        <PageRouteLayout
            title='Utilisateurs'
            icon={Users}
            boutonAddTitle='Ajouter un utilisateur'
            addDialogComponent={UtilisateurDialog}
            listComponent={ListeUtilisateurs}
        />
    )
}