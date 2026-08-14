import { createFileRoute } from '@tanstack/react-router'
import { useProjetStore } from '@/stores/projet-store'
import ProjetActivitesPanel from '@/simadou/allfonctionalities/projets/detail/activities/ProjetActivitesPanel'

export const Route = createFileRoute('/_authenticated/activites')({
  component: ProjetActivitesPanelWrapper,
})

function ProjetActivitesPanelWrapper() {
  const activeProjet = useProjetStore((s) => s.activeProjet)
  if (!activeProjet) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-muted-foreground">
        Veuillez sélectionner un projet
      </div>
    )
  }

  return <ProjetActivitesPanel projet={activeProjet} />
}
