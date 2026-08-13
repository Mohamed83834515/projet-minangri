import { createFileRoute } from '@tanstack/react-router'
import { useProjetStore } from '@/stores/projet-store'
import ProjetDocumentsPanel from '@/simadou/allfonctionalities/projets/detail/documents/ProjetDocumentsPanel'

export const Route = createFileRoute('/_authenticated/documents')({
  component: ProjetDocumentsPanelWrapper,
})

function ProjetDocumentsPanelWrapper() {
  const activeProjet = useProjetStore((s) => s.activeProjet)

  if (!activeProjet) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-muted-foreground">
        Veuillez sélectionner un projet
      </div>
    )
  }

  return <ProjetDocumentsPanel projet={activeProjet} />
}
