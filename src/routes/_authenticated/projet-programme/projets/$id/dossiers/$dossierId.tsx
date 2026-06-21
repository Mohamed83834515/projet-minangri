import { createFileRoute } from '@tanstack/react-router'
import ProjetDossierDetailPage from '@/simadou/allfonctionalities/projets/detail/documents/ProjetDossierDetailPage'

export const Route = createFileRoute(
  '/_authenticated/projet-programme/projets/$id/dossiers/$dossierId'
)({
  component: ProjetDossierDetailPage,
})
