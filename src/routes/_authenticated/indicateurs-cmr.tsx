import { createFileRoute } from '@tanstack/react-router'
import { useProjetStore } from '@/stores/projet-store'
import ProjetIndicateursCmrPanel from '@/simadou/allfonctionalities/projets/detail/cmrIndicators/ProjetIndicateursCmrPanel'

export const Route = createFileRoute('/_authenticated/indicateurs-cmr')({
  component: ProjetIndicateursCmrPanelWrapper,
})

function ProjetIndicateursCmrPanelWrapper() {
  const activeProjet = useProjetStore((s) => s.activeProjet)

  if (!activeProjet) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-muted-foreground">
        Veuillez sélectionner un projet
      </div>
    )
  }

  return <ProjetIndicateursCmrPanel projet={activeProjet} />
}
