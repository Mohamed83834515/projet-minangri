import { createFileRoute } from '@tanstack/react-router'
import { useProjetStore } from '@/stores/projet-store'
import ProjetPointsBlocagePanel from '@/simadou/allfonctionalities/projets/detail/points-blocage/ProjetPointsBlocagePanel'

export const Route = createFileRoute('/_authenticated/points-blocage')({
  component: ProjetPointsBlocagePanelWrapper,
})

function ProjetPointsBlocagePanelWrapper() {
  const activeProjet = useProjetStore((s) => s.activeProjet)

  if (!activeProjet) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-muted-foreground">
        Veuillez sélectionner un projet
      </div>
    )
  }

  return <ProjetPointsBlocagePanel projet={activeProjet} />
}
