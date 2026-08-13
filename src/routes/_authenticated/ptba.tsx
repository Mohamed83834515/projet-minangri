import { createFileRoute } from '@tanstack/react-router'
import { useProjetStore } from '@/stores/projet-store'
import ProjetPtbaPanel from '@/simadou/allfonctionalities/projets/detail/ptba/ProjetPtbaPanel'

export const Route = createFileRoute('/_authenticated/ptba')({
  component: ProjetPtbaPanelWrapper,
})

function ProjetPtbaPanelWrapper() {
  const activeProjet = useProjetStore((s) => s.activeProjet)

  if (!activeProjet) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-muted-foreground">
        Veuillez sélectionner un projet
      </div>
    )
  }

  return <ProjetPtbaPanel projet={activeProjet} />
}
