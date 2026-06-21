import { useMemo } from 'react'
import { Link, getRouteApi } from '@tanstack/react-router'
import { ArrowLeft, FolderOpen, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  useGetDossierProjet,
  useGetDossiersProjet,
} from '@/simadou/allHooks/admin/dossierProjetHooks'
import { useGetProjet } from '@/simadou/allHooks/admin/projetHooks'
import { resolveProjetRouteId } from '@/simadou/allfonctionalities/projets/detail/projetDetailUtils'
import ProjetDossierDocumentsPanel from './ProjetDossierDocumentsPanel'

const route = getRouteApi(
  '/_authenticated/projet-programme/projets/$id/dossiers/$dossierId'
)

export default function ProjetDossierDetailPage() {
  const { id, dossierId } = route.useParams()
  const dossierIdNum = Number(dossierId)
  const validDossierId =
    Number.isFinite(dossierIdNum) && dossierIdNum > 0 ? dossierIdNum : undefined

  const {
    data: projet,
    isLoading: isLoadingProjet,
    isError: isProjetError,
  } = useGetProjet(id)
  const { data: dossiers = [], isLoading: isLoadingDossiers } =
    useGetDossiersProjet(projet?.id_projet)
  const { data: dossierById, isLoading: isLoadingDossierById } =
    useGetDossierProjet(validDossierId)

  const dossier = useMemo(() => {
    if (!validDossierId) return undefined
    return (
      dossiers.find((item) => item.id_dossier === validDossierId) ?? dossierById
    )
  }, [dossierById, dossiers, validDossierId])

  const isLoading =
    isLoadingProjet ||
    (projet != null && isLoadingDossiers) ||
    (dossier == null && isLoadingDossierById)

  const isError = isProjetError || !projet || !validDossierId || !dossier

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-24'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (isError) {
    return (
      <div className='space-y-4 p-4'>
        <Button variant='outline' size='sm' asChild>
          <Link to='/projet-programme/projets/$id' params={{ id }}>
            <ArrowLeft className='me-2 h-4 w-4' />
            Retour au projet
          </Link>
        </Button>
        <p className='py-12 text-center text-sm text-muted-foreground'>
          Dossier introuvable.
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-4 px-4 py-4'>
      <div className='flex items-center justify-between gap-4'>
        <Button variant='outline' size='sm' asChild className='shrink-0'>
          <Link
            to='/projet-programme/projets/$id'
            params={{ id: resolveProjetRouteId(projet) }}
          >
            <ArrowLeft className='me-2 h-4 w-4' />
            Retour au projet
          </Link>
        </Button>

        <h2 className='flex min-w-0 flex-1 items-center justify-center gap-2 text-center text-lg font-semibold'>
          <FolderOpen className='hidden h-5 w-5 shrink-0 text-muted-foreground sm:inline' />
          <span className='truncate'>{dossier.nom_dossier}</span>
        </h2>

        <div className='w-[88px] shrink-0' aria-hidden />
      </div>

      <Card>
        <CardContent className='p-4'>
          <ProjetDossierDocumentsPanel projet={projet} dossier={dossier} />
        </CardContent>
      </Card>
    </div>
  )
}
