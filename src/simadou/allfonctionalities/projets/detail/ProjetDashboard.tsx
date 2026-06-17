// ProjetDashboard.tsx
import { useMemo, useState } from 'react'
import {
  Activity, BarChart3, DollarSign, Wallet,
  Calendar, FileText, Gauge, Rocket, Shield,
  TrendingUp, CheckCircle2, Clock, Circle,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Projet } from '@/simadou/allTypes'
import { useGetActivitesProjet } from '@/simadou/allHooks/admin/activiteProjetHooks'
import { useGetPtbasProjet } from '@/simadou/allHooks/admin/ptbaProjetHooks'
import { formatNumber } from '@/simadou/allSercices/montantFormater'
import { KpiIndicateurs } from './KpiIndicateurs'

interface ProjetDashboardProps { projet: Projet }

const PtbaYear = ({ annee }: { annee: number }) => (
  <span>PTBA <span className='text-primary font-bold'>{annee}</span></span>
)

export default function ProjetDashboard({ projet }: ProjetDashboardProps) {
  const projectYears = useMemo(() => {
    if (!projet?.date_demarrage_projet || !projet?.duree_projet) {
      return [new Date().getFullYear()]
    }
    const start = new Date(projet.date_demarrage_projet)
    const startYear = start.getFullYear()
    const endDate = new Date(start)
    endDate.setMonth(endDate.getMonth() + projet.duree_projet)
    const endYear = endDate.getFullYear()

    const years: number[] = []
    for (let year = startYear; year <= endYear; year++) {
      years.push(year)
    }
    return years
  }, [projet])

  const defaultYear = projectYears[projectYears.length - 1] || new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(defaultYear)

  const { data: activites = [] } = useGetActivitesProjet(projet?.code_projet)
  const { data: ptbas = [] } = useGetPtbasProjet(projet?.code_projet)

  // Calcul des statistiques
  const totalActivites = activites.length
  const activitesTerminees = 0

  const budget_total = useMemo(() => {
    if (activites.length === 0) return 0
    return activites.reduce((sum, act) => {
      return sum + (Number(act.budget) || 0)
    }, 0)
  }, [activites])

  const budget_decaisse = useMemo(() => {
    if (ptbas.length === 0) return 0
    return ptbas.reduce((sum, pt) => {
      return sum + (Number(pt.montant_decaisse_ptba) || 0)
    }, 0)
  }, [ptbas])

  const ptbasFiltres = useMemo(() => {
    if (ptbas.length === 0) return []
    return ptbas.filter(ptba =>
      ptba.version_info?.annee_ptba === selectedYear
    )
  }, [ptbas, selectedYear])

  const totalPtbas = ptbasFiltres.length

  const tauxRealisationMoyen = useMemo(() => {
    if (ptbasFiltres.length === 0) return 0
    const totalTaux = ptbasFiltres.reduce((sum, ptba) => {
      return sum + (Number(ptba.taux_execution_ptba) || 0)
    }, 0)
    return Math.round(totalTaux / ptbasFiltres.length)
  }, [ptbasFiltres])

  const tauxExecutionGlobale = useMemo(() => {
    if (ptbas.length === 0) return 0
    const totalTaux = ptbas.reduce((sum, ptba) => {
      return sum + (Number(ptba.taux_execution_ptba) || 0)
    }, 0)
    return Math.round(totalTaux / ptbas.length)
  }, [ptbas])

  const activitesRealisees = useMemo(() => {
    return ptbas.filter(ptba => Number(ptba.taux_execution_ptba) >= 100).length
  }, [ptbas])

  const tauxDecaissementMoyen = useMemo(() => {
    if (ptbasFiltres.length === 0) return 0
    const totalTaux = ptbasFiltres.reduce((sum, ptba) => {
      return sum + (Number(ptba.taux_decaissement_ptba) || 0)
    }, 0)
    return Math.round(totalTaux / ptbasFiltres.length)
  }, [ptbasFiltres])

  const montantDecaisseTotal = useMemo(() => {
    if (ptbasFiltres.length === 0) return 0
    return ptbasFiltres.reduce((sum, pt) => {
      return sum + (Number(pt.montant_decaisse_ptba) || 0)
    }, 0)
  }, [ptbasFiltres])

  // Calcul des données par année pour le graphique
  const decaissementParAnnee = useMemo(() => {
    // Grouper les PTBA par année
    const groupedByYear = ptbas.reduce((acc, ptba) => {
      const annee = ptba.version_info?.annee_ptba
      if (!annee) return acc
      if (!acc[annee]) {
        acc[annee] = []
      }
      acc[annee].push(ptba)
      return acc
    }, {} as Record<number, typeof ptbas>)

    // Pour chaque année, calculer le taux de décaissement moyen
    return projectYears
      .filter(year => year <= Math.max(...Object.keys(groupedByYear).map(Number), projectYears[0]))
      .map((annee) => {
        const items = groupedByYear[annee] || []
        if (items.length === 0) {
          return { annee, taux: 0, total: 0 }
        }

        const totalTaux = items.reduce((sum, ptba) => {
          return sum + (Number(ptba.taux_decaissement_ptba) || 0)
        }, 0)

        const tauxMoyen = Math.round(totalTaux / items.length)
        return {
          annee,
          taux: tauxMoyen,
          total: items.length
        }
      })
  }, [ptbas, projectYears])

  const maxDecaissement = Math.max(...decaissementParAnnee.map((d) => d.taux), 1)

  // Fonction pour obtenir la couleur en fonction du taux
  const getTauxColor = (taux: number) => {
    if (taux >= 80) return {
      bg: 'bg-emerald-500',
      badge: 'bg-emerald-100 text-emerald-700',
      text: 'text-emerald-600'
    }
    if (taux >= 50) return {
      bg: 'bg-amber-500',
      badge: 'bg-amber-100 text-amber-700',
      text: 'text-amber-600'
    }
    if (taux >= 20) return {
      bg: 'bg-orange-500',
      badge: 'bg-orange-100 text-orange-700',
      text: 'text-orange-600'
    }
    return {
      bg: 'bg-red-500',
      badge: 'bg-red-100 text-red-700',
      text: 'text-red-600'
    }
  }

  const budgetPct = useMemo(() => {
    if (budget_total === 0) return 0
    return Math.round((budget_decaisse / budget_total) * 100)
  }, [budget_total, budget_decaisse])

  const tauxDecaissement = useMemo(() => {
    if (budget_total === 0) return 0
    return Math.round((montantDecaisseTotal / budget_total) * 100)
  }, [budget_total, montantDecaisseTotal])

  const budgetColor = getTauxColor(budgetPct)
  const decaissementColor = getTauxColor(tauxDecaissement)

  // Calculer l'exécution par PTBA
  const yearsToShow = useMemo(() => {
    const anneesAvecPtbas = ptbas
      .map(ptba => ptba.version_info?.annee_ptba)
      .filter((annee): annee is number => annee !== undefined && !isNaN(annee))

    if (anneesAvecPtbas.length === 0) {
      return [projectYears[0] || new Date().getFullYear()]
    }
    const anneeMax = Math.max(...anneesAvecPtbas)
    return projectYears.filter(year => year <= anneeMax)
  }, [ptbas, projectYears])

  const ptbaExecutionData = useMemo(() => {
    const groupedByYear = ptbas.reduce((acc, ptba) => {
      const annee = ptba.version_info?.annee_ptba
      if (!annee) return acc
      if (!acc[annee]) {
        acc[annee] = []
      }
      acc[annee].push(ptba)
      return acc
    }, {} as Record<number, typeof ptbas>)

    return yearsToShow.map((year) => {
      const items = groupedByYear[year] || []
      const totalActivites = items.length
      const activitesTerminees = items.filter(
        ptba => Number(ptba.taux_execution_ptba) >= 100
      ).length

      const totalTaux = items.reduce((sum, ptba) => {
        return sum + (Number(ptba.taux_execution_ptba) || 0)
      }, 0)

      const tauxMoyen = totalActivites > 0
        ? Math.round(totalTaux / totalActivites)
        : 0

      const getColor = (taux: number) => {
        if (taux >= 80) return { bg: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700' }
        if (taux >= 50) return { bg: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700' }
        if (taux === 0 && totalActivites === 0) return { bg: 'bg-gray-300', badge: 'bg-gray-100 text-gray-500' }
        return { bg: 'bg-red-400', badge: 'bg-red-100 text-red-700' }
      }

      const col = getColor(tauxMoyen)

      let Icon = Circle
      let iconColor = 'text-gray-400'

      if (totalActivites === 0) {
        Icon = Circle
        iconColor = 'text-gray-300'
      } else if (tauxMoyen >= 80) {
        Icon = CheckCircle2
        iconColor = 'text-emerald-500'
      } else if (tauxMoyen >= 40) {
        Icon = Clock
        iconColor = 'text-amber-500'
      } else {
        Icon = Circle
        iconColor = 'text-red-400'
      }

      return {
        annee: year,
        taux: tauxMoyen,
        totalActivites,
        terminees: activitesTerminees,
        col,
        Icon,
        iconColor,
        hasActivites: totalActivites > 0,
        budgetPrevu: items.reduce((sum, ptba) => sum + (Number(ptba.cout_ptba) || 0), 0),
        budgetExecute: items.reduce((sum, ptba) => sum + (Number(ptba.montant_decaisse_ptba) || 0), 0),
      }
    })
  }, [ptbas, yearsToShow])

  return (
    <div className='space-y-6 p-2'>
      {/* En-tête */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
            Tableau de bord
          </h2>
          <p className='text-sm text-muted-foreground'>Vue d'ensemble de l'avancement du projet</p>
        </div>
        <div className='flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5'>
          <Calendar className='h-4 w-4 text-muted-foreground' />
          <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
            <SelectTrigger className='w-[130px] border-0 bg-transparent'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {projectYears.map((year) => (
                <SelectItem key={year} value={String(year)}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cartes KPI */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
        <Card className='border-l-4 border-l-blue-500'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs font-semibold uppercase text-muted-foreground'>Activités Du Projet</p>
                <p className='mt-2 text-2xl font-bold'>{totalActivites}</p>
                <p className='text-xs text-muted-foreground'>{activitesTerminees} terminées</p>
              </div>
              <div className='rounded-full bg-blue-500/10 p-3'>
                <Activity className='h-5 w-5 text-blue-500' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-950/20'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs font-semibold uppercase text-muted-foreground'>Budget total</p>
                <p className='mt-2 text-xl font-bold text-purple-700 dark:text-purple-400'>{formatNumber(budget_total)} GNF</p>
                <p className='text-xs text-muted-foreground'>{formatNumber(budget_decaisse)} consommé</p>
              </div>
              <div className='rounded-full bg-purple-500/20 p-3'><Wallet className='h-5 w-5 text-purple-600' /></div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-l-4 border-l-emerald-500'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs font-semibold uppercase text-muted-foreground'>PTBA de l'année {selectedYear}</p>
                <p className='mt-2 text-2xl font-bold'>{totalPtbas}</p>
                <p className='text-xs text-muted-foreground'>{activitesTerminees} realisée(s)</p>
              </div>
              <div className='rounded-full bg-emerald-500/10 p-3'>
                <FileText className='h-5 w-5 text-emerald-500' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-l-4 border-l-amber-500'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs font-semibold uppercase text-muted-foreground'>taux d'exécution physique</p>
                <p className='mt-2 text-2xl font-bold'>{tauxRealisationMoyen}%</p>
                <Progress value={tauxRealisationMoyen} className='mt-1 h-1.5' />
              </div>
              <div className='rounded-full bg-amber-500/10 p-3'><Gauge className='h-5 w-5 text-amber-500' /></div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-l-4 border-l-green-600'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex-1'>
                <p className='text-xs font-semibold uppercase text-muted-foreground'>Taux Décaissement</p>
                <div className='mt-0.5 flex items-baseline gap-2'>
                  <p className='text-sm font-semibold text-green-600'>
                    {formatNumber(montantDecaisseTotal)} GNF
                  </p>
                </div>
                <div className='mt-1 flex items-baseline gap-2'>
                  <p className='text-2xl font-bold'>{tauxDecaissementMoyen}%</p>
                </div>
                <Progress value={tauxDecaissementMoyen} className='mt-1.5 h-1.5' />
              </div>
              <div className='rounded-full bg-green-600/10 p-3'>
                <DollarSign className='h-5 w-5 text-green-600' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jauge + Exécution par PTBA */}
      <div className='grid gap-6 lg:grid-cols-2'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center gap-2 text-sm'>
              <Rocket className='h-4 w-4 text-primary' />
              Taux d'exécution global
            </CardTitle>
            <CardDescription>Progression cumulée de toutes les activités du PTBA</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col items-center'>
            <div className='relative w-44 h-44'>
              <svg className='w-full h-full' viewBox='0 0 100 100'>
                <circle cx='50' cy='50' r='40' fill='transparent' stroke='currentColor' strokeWidth='8' className='text-muted-foreground/20' />
                <circle cx='50' cy='50' r='40' fill='transparent' stroke='#10B981' strokeWidth='8' strokeLinecap='round' strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * (1 - tauxExecutionGlobale / 100)} transform='rotate(-90 50 50)' />
                <text x='50' y='46' textAnchor='middle' dominantBaseline='middle' fontSize='18' fontWeight='bold' className='fill-foreground'>{tauxExecutionGlobale}%</text>
                <text x='50' y='60' textAnchor='middle' fontSize='7' className='fill-muted-foreground'>exécution</text>
              </svg>
            </div>
            <p className='mt-3 text-sm text-muted-foreground'>
              {activitesRealisees} / {ptbas.length} activités réalisées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center gap-2 text-sm'>
              <TrendingUp className='h-4 w-4 text-primary' />
              Exécution par PTBA
            </CardTitle>
            <CardDescription>Taux de réalisation par plan annuel</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {ptbaExecutionData.length === 0 ? (
              <p className='text-sm text-muted-foreground text-center py-4'>Aucune donnée d'exécution disponible</p>
            ) : (
              ptbaExecutionData.map((ptba) => {
                const isInactive = !ptba.hasActivites
                const displayTaux = isInactive ? 0 : ptba.taux
                const displayTerminees = isInactive ? 0 : ptba.terminees
                const displayTotal = isInactive ? 0 : ptba.totalActivites

                return (
                  <div key={ptba.annee} className={isInactive ? 'opacity-60' : ''}>
                    <div className='flex items-center justify-between mb-1.5'>
                      <div className='flex items-center gap-1.5 text-sm'>
                        <ptba.Icon className={`h-3.5 w-3.5 ${ptba.iconColor}`} />
                        <span className='font-medium'>{ptba.annee}</span>
                        {isInactive && <span className='text-xs text-muted-foreground ml-1'>(aucun PTBA)</span>}
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs text-muted-foreground'>{displayTerminees}/{displayTotal} activités</span>
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${ptba.col.badge}`}>{displayTaux}%</span>
                      </div>
                    </div>
                    <div className='h-2 w-full rounded-full bg-muted overflow-hidden'>
                      <div className={`h-full rounded-full ${ptba.col.bg} transition-all duration-700`} style={{ width: `${displayTaux}%` }} />
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Graphique Taux de décaissement par année avec vraies données */}

      <div className='grid gap-6 lg:grid-cols-2'>
        <Card className='shadow-sm overflow-hidden'>
          <CardHeader className='pb-2 border-b bg-gradient-to-r from-primary/5 to-transparent'>
            <CardTitle className='flex items-center gap-2 text-sm font-semibold'>
              <BarChart3 className='h-4 w-4 text-primary' />
              Taux de décaissement par année
            </CardTitle>
            <CardDescription>Évolution du taux de décaissement annuel (%)</CardDescription>
          </CardHeader>
          <CardContent className='pt-6'>
            <div className='flex items-end justify-between gap-4 h-64 px-2'>
              {decaissementParAnnee.map((item) => {
                const height = (item.taux / maxDecaissement) * 180
                const col = getTauxColor(item.taux)
                const isSel = item.annee === selectedYear

                return (
                  <div
                    key={item.annee}
                    className={`flex-1 flex flex-col items-center gap-2 group transition-all duration-300 cursor-pointer ${isSel ? 'scale-105' : 'hover:scale-105'
                      }`}
                    onClick={() => setSelectedYear(item.annee)}
                  >
                    <div className='relative w-full flex justify-center'>
                      <div className='flex flex-col items-center'>
                        {/* Tooltip */}
                        <div className='text-[10px] font-medium mb-1 opacity-0 group-hover:opacity-100 transition-all duration-300'>
                          <div className='bg-foreground/90 text-background px-2 py-1 rounded-md shadow-lg'>
                            {item.taux}% • {item.total} PTBA
                          </div>
                        </div>

                        {/* Barre */}
                        <div className='relative'>
                          <div
                            className={`w-12 rounded-t-lg ${col.bg} transition-all duration-500 hover:shadow-lg relative overflow-hidden`}
                            style={{
                              height: `${Math.max(height, 8)}px`,
                              minHeight: '8px',
                              boxShadow: isSel ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                            }}
                          >
                            {/* Effet de brillance */}
                            <div className='absolute inset-0 bg-gradient-to-t from-white/0 to-white/20' />
                          </div>

                          {/* Valeur sur la barre */}
                          {item.taux > 0 && (
                            <span className='absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-foreground/70'>
                              {item.taux}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Année et badge */}
                    <div className='text-center mt-3'>
                      <div className='flex items-center gap-1.5 justify-center'>
                        <span className={`text-sm font-semibold transition-colors duration-300 ${isSel ? 'text-primary' : 'text-foreground/80'
                          }`}>
                          {item.annee}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badge} transition-all duration-300 ${isSel ? 'scale-110 ring-2 ring-primary/20' : ''
                          }`}>
                          {item.taux}%
                        </span>
                      </div>
                      <div className='mt-1 text-[10px] text-muted-foreground'>
                        {item.total} PTBA
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Légende */}
            <div className='mt-6 pt-4 border-t flex flex-wrap items-center justify-center gap-4'>
              <div className='flex items-center gap-2'>
                <div className='h-3 w-3 rounded-full bg-emerald-500' />
                <span className='text-xs text-muted-foreground'>≥ 80%</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-3 w-3 rounded-full bg-amber-500' />
                <span className='text-xs text-muted-foreground'>50-79%</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-3 w-3 rounded-full bg-orange-500' />
                <span className='text-xs text-muted-foreground'>20-49%</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-3 w-3 rounded-full bg-red-500' />
                <span className='text-xs text-muted-foreground'>&lt; 20%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Détail budget */}
        <Card className='shadow-sm'>
          <CardHeader className='pb-2 border-b bg-muted/20'>
            <CardTitle className='flex items-center gap-2 text-sm font-semibold'>
              <Wallet className='h-4 w-4 text-primary' />
              Détail budget Total
            </CardTitle>
            <CardDescription>Récapitulatif des montants et écarts</CardDescription>
          </CardHeader>
          <CardContent className='pt-6 space-y-4'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>Taux de consommation</span>
              <span className={`text-xl font-bold ${budgetColor.text}`}>{budgetPct}%</span>
            </div>
            <div className='h-2.5 w-full rounded-full bg-muted overflow-hidden'>
              <div className={`h-full rounded-full ${budgetColor.bg} transition-all duration-700`} style={{ width: `${budgetPct}%` }} />
            </div>

            <div className='rounded-lg bg-muted/30 p-4 space-y-3'>
              <div className='flex justify-between items-center pb-2 border-b'>
                <span className='text-sm text-muted-foreground'>Décaissé</span>
                <span className='text-lg font-bold text-emerald-600'>{formatNumber(montantDecaisseTotal)} GNF</span>
              </div>
              <div className='flex justify-between items-center pb-2 border-b'>
                <span className='text-sm text-muted-foreground'>Prévu</span>
                <span className='text-lg font-bold'>{formatNumber(budget_total)} GNF</span>
              </div>
              <div className='flex justify-between items-center pb-2 border-b'>
                <span className='text-sm text-muted-foreground'>Écart</span>
                <span className='text-lg font-bold text-red-500'>{formatNumber(budget_total - montantDecaisseTotal)} GNF</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-muted-foreground'>Reste à décaisser</span>
                <span className='text-lg font-bold text-amber-600'>{100 - budgetPct}%</span>
              </div>
            </div>

            <div className='flex justify-between items-center pt-2 border-t'>
              <span className='text-sm text-muted-foreground'>Taux de décaissement</span>
              <span className={`text-xl font-bold ${decaissementColor.text}`}>{tauxDecaissement}%</span>
            </div>
            <div className='h-2 w-full rounded-full bg-muted overflow-hidden'>
              <div className={`h-full rounded-full ${decaissementColor.bg} transition-all duration-700`} style={{ width: `${tauxDecaissement}%` }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Indicateurs */}
      <KpiIndicateurs projet={projet} />
    </div>
  )
}