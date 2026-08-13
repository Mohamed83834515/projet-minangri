import { createFileRoute } from '@tanstack/react-router'
import { useProjetStore } from '@/stores/projet-store'
import ProjetSuiviPtbaPanel from '@/simadou/allfonctionalities/projets/detail/suivi-ptba/ProjetSuiviPtbaPanel'

export const Route = createFileRoute('/_authenticated/suivi-ptba')({
  component: ProjetSuiviPtbaPanelWrapper,
})

function ProjetSuiviPtbaPanelWrapper() {
  const activeProjet = useProjetStore((s) => s.activeProjet)

  if (!activeProjet) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-muted-foreground">
        Veuillez sélectionner un projet
      </div>
    )
  }

  return <ProjetSuiviPtbaPanel projet={activeProjet} />
}
