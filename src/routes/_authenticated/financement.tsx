import { createFileRoute } from '@tanstack/react-router'
import { useProjetStore } from '@/stores/projet-store'
import ProjetFinancementPanel from '@/simadou/allfonctionalities/projets/detail/financement/ProjetFinancementPanel'

export const Route = createFileRoute('/_authenticated/financement')({
  component: ProjetFinancementPanelWrapper,
})

function ProjetFinancementPanelWrapper() {
  const activeProjet = useProjetStore((s) => s.activeProjet)

  if (!activeProjet) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-muted-foreground">
        Veuillez sélectionner un projet
      </div>
    )
  }

  return <ProjetFinancementPanel projet={activeProjet} />
}
