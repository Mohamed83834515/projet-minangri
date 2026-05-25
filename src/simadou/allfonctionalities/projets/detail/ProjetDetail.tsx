import { useMemo, useState } from 'react'
import { Link, getRouteApi } from '@tanstack/react-router'
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Layout,
  Loader2,
  MapPin,
  User,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useGetProjets } from '@/simadou/allHooks/admin/projetHooks'
import type { Projet } from '@/simadou/allTypes/projet'
import ProjetDetailTabPanel from './ProjetDetailTabPanel'
import {
  projetDetailTabs,
  type ProjetDetailTab,
} from './projetDetailTabs'

const route = getRouteApi('/_authenticated/programmation/projets/$id')

function formatDateFr(value: string | undefined): string {
  if (!value) return '—'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('fr-FR')
}

function computeDateFin(projet: Projet): string {
  const start = projet.date_demarrage_projet
    ? new Date(projet.date_demarrage_projet)
    : null
  if (!start || Number.isNaN(start.getTime())) return '—'
  const end = new Date(start)
  end.setMonth(end.getMonth() + (projet.duree_projet || 0))
  return end.toLocaleDateString('fr-FR')
}

function ActeurList({ items, emptyLabel }: { items: string[]; emptyLabel: string }) {
  if (items.length === 0) {
    return <p className='text-xs text-muted-foreground'>{emptyLabel}</p>
  }
  return (
    <ul className='space-y-1'>
      {items.map((name) => (
        <li key={name} className='text-xs font-medium leading-snug'>
          {name}
        </li>
      ))}
    </ul>
  )
}

export default function ProjetDetail() {
  const { id } = route.useParams()
  const { data: projets = [], isLoading } = useGetProjets()
  const [selectedTab, setSelectedTab] = useState<ProjetDetailTab>(
    projetDetailTabs[0]
  )

  const projet = useMemo(
    () => projets.find((p) => String(p.id_projet) === id),
    [projets, id]
  )

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-24'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (!projet) {
    return (
      <div className='space-y-4 p-4'>
        <Button variant='outline' size='sm' asChild>
          <Link to='/programmation/projets'>
            <ArrowLeft className='h-4 w-4' />
            Retour aux projets
          </Link>
        </Button>
        <p className='text-center text-sm text-muted-foreground py-12'>
          Projet introuvable ou non rattaché au programme actif.
        </p>
      </div>
    )
  }

  const structures =
    projet.structure_projet?.map((a) => a.nom_acteur).filter(Boolean) ?? []
  const signataires =
    projet.signataires_projet?.map((a) => a.nom_acteur).filter(Boolean) ?? []
  const partenairesExec =
    projet.partenaires_execution_projet?.map((a) => a.nom_acteur).filter(Boolean) ??
    []
  const zones =
    projet.zone_projet?.map((z) => z.intitule_loca).filter(Boolean) ?? []

  return (
    <div className='flex flex-col gap-6 p-4'>
      <div className='flex items-center gap-4'>
        <Button variant='outline' size='icon' className='shrink-0' asChild>
          <Link to='/programmation/projets'>
            <ArrowLeft className='h-4 w-4' />
            <span className='sr-only'>Retour</span>
          </Link>
        </Button>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            {projet.sigle_projet}
          </h2>
          <p className='font-mono text-sm text-muted-foreground'>
            #{projet.code_projet}
          </p>
        </div>
      </div>

      <div className='flex min-h-[600px] flex-col items-start gap-6 lg:flex-row'>
        <aside className='w-full shrink-0 space-y-4 lg:sticky lg:top-6 lg:w-80'>
          <Card className='gap-0 overflow-hidden py-0'>
            <CardHeader className='border-b bg-primary/5 py-4'>
              <div className='flex items-start gap-3'>
                <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
                  <Layout className='h-4 w-4' />
                </div>
                <div className='min-w-0'>
                  <CardTitle className='text-sm leading-snug'>
                    {projet.intitule_projet}
                  </CardTitle>
                  <CardDescription className='font-mono text-[10px] font-bold uppercase'>
                    {projet.code_projet}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-5 p-5'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <span className='mb-1 flex items-center gap-1 text-[10px] font-bold tracking-tight text-muted-foreground uppercase'>
                    <Calendar className='h-2.5 w-2.5 text-primary' />
                    Début
                  </span>
                  <span className='text-xs font-semibold'>
                    {formatDateFr(projet.date_demarrage_projet)}
                  </span>
                </div>
                <div>
                  <span className='mb-1 flex items-center gap-1 text-[10px] font-bold tracking-tight text-muted-foreground uppercase'>
                    <Calendar className='h-2.5 w-2.5 text-orange-500' />
                    Fin
                  </span>
                  <span className='text-xs font-semibold'>
                    {computeDateFin(projet)}
                  </span>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4 border-t pt-4'>
                <div>
                  <span className='mb-1 flex items-center gap-1 text-[10px] font-bold tracking-tight text-muted-foreground uppercase'>
                    <Clock className='h-2.5 w-2.5 text-primary' />
                    Durée
                  </span>
                  <span className='text-xs font-semibold'>
                    {projet.duree_projet} mois
                  </span>
                </div>
                <div>
                  <span className='mb-1 flex items-center gap-1 text-[10px] font-bold tracking-tight text-muted-foreground uppercase'>
                    <DollarSign className='h-2.5 w-2.5 text-green-600' />
                    Coût total
                  </span>
                  <span className='text-xs font-semibold'>
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'XOF',
                      maximumFractionDigits: 0,
                    }).format(0)}
                  </span>
                </div>
              </div>

              <div className='border-t pt-4'>
                <span className='mb-1 flex items-center gap-1 text-[10px] font-bold tracking-tight text-muted-foreground uppercase'>
                  <Calendar className='h-2.5 w-2.5' />
                  Signature
                </span>
                <span className='text-xs font-semibold'>
                  {formatDateFr(projet.date_signature_projet)}
                </span>
              </div>

              <div className='border-t pt-4'>
                <span className='mb-1 flex items-center gap-1 text-[10px] font-bold tracking-tight text-muted-foreground uppercase'>
                  <User className='h-2.5 w-2.5 text-primary' />
                  Partenaire principal
                </span>
                <p className='text-xs font-semibold leading-snug'>
                  {projet.partenaire_projet?.nom_acteur?.trim() || '—'}
                </p>
              </div>

              <div className='space-y-3 border-t pt-4'>
                <div>
                  <span className='mb-1 flex items-center gap-1 text-[10px] font-bold tracking-tight text-muted-foreground uppercase'>
                    <Users className='h-2.5 w-2.5' />
                    Unité de gestion
                  </span>
                  <ActeurList items={structures} emptyLabel='—' />
                </div>
                <div>
                  <span className='mb-1 flex items-center gap-1 text-[10px] font-bold tracking-tight text-muted-foreground uppercase'>
                    Signataires
                  </span>
                  <ActeurList items={signataires} emptyLabel='—' />
                </div>
                <div>
                  <span className='mb-1 flex items-center gap-1 text-[10px] font-bold tracking-tight text-muted-foreground uppercase'>
                    Partenaires d&apos;exécution
                  </span>
                  <ActeurList items={partenairesExec} emptyLabel='—' />
                </div>
                <div>
                  <span className='mb-1 flex items-center gap-1 text-[10px] font-bold tracking-tight text-muted-foreground uppercase'>
                    <MapPin className='h-2.5 w-2.5' />
                    Zones
                  </span>
                  <ActeurList items={zones} emptyLabel='—' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='gap-1 py-4'>
            <CardHeader className='border-b px-4 pb-3'>
              <CardTitle className='text-[10px] font-bold tracking-widest text-muted-foreground uppercase'>
                Navigation &amp; suivi
              </CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-1 px-2 pb-2'>
              {projetDetailTabs.map((tab) => {
                const isActive = selectedTab.key === tab.key
                const TabIcon = tab.icon
                return (
                  <Button
                    key={tab.key}
                    type='button'
                    variant={isActive ? 'default' : 'ghost'}
                    className={cn(
                      'h-auto w-full justify-start gap-3 px-3 py-2.5 text-sm font-semibold',
                      isActive && 'shadow-sm'
                    )}
                    onClick={() => setSelectedTab(tab)}
                  >
                    <TabIcon
                      className={cn(
                        'h-4 w-4 shrink-0',
                        isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                      )}
                    />
                    <span className='truncate text-start'>{tab.name}</span>
                  </Button>
                )
              })}
            </CardContent>
          </Card>
        </aside>

        <main className='min-w-0 flex-1'>
          <Card className='min-h-[600px]'>
            <CardHeader className='border-b'>
              <CardTitle className='text-base'>{selectedTab.name}</CardTitle>
              <CardDescription>{selectedTab.description}</CardDescription>
            </CardHeader>
            <CardContent className='p-6'>
              <ProjetDetailTabPanel tab={selectedTab} />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
