import { createFileRoute } from '@tanstack/react-router'
import { useProjetStore } from '@/stores/projet-store'
import ProjetConventionPanel from '@/simadou/allfonctionalities/projets/detail/conventions/ProjetConventionPanel'

export const Route = createFileRoute('/_authenticated/conventions')({
  component: ProjetConventionPanelWrapper,
})

function ProjetConventionPanelWrapper() {
  const activeProjet = useProjetStore((s) => s.activeProjet)

  if (!activeProjet) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-muted-foreground">
        Veuillez sélectionner un projet
      </div>
    )
  }

  return <ProjetConventionPanel projet={activeProjet} />
}
