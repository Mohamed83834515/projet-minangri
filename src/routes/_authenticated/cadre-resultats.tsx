import { createFileRoute } from '@tanstack/react-router'
import { useProjetStore } from '@/stores/projet-store'
import ProjetCadreResultatsPanel from '@/simadou/allfonctionalities/projets/detail/resultsFramework/ProjetCadreResultatsPanel'

export const Route = createFileRoute('/_authenticated/cadre-resultats')({
  component: ProjetCadreResultatsPanelWrapper,
})

function ProjetCadreResultatsPanelWrapper() {
  const activeProjet = useProjetStore((s) => s.activeProjet)

  if (!activeProjet) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-muted-foreground">
        Veuillez sélectionner un projet
      </div>
    )
  }

  return <ProjetCadreResultatsPanel projet={activeProjet} />
}
