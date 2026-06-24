import React, { useMemo, useState } from 'react'
import { useGetProjets } from '@/simadou/allHooks/admin/projetHooks'
import { useCountProjectsPerType } from '@/simadou/allHooks/admin/typeProjetHooks'
import {
    useActiveProgrammeCode,
    useActiveProgrammeId,
} from '@/hooks/use-active-programme'
import DashboardHeader from './DashboardHeader'
import ProjectTable, { type ProjetRow } from './ProjectTable'
import StatCard from './StatCard'

// ─── Dashboard principal ───────────────────────────────────────────────────────
const DashboardPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('')

    const codeProgramme = useActiveProgrammeCode()
    const idProgramme = useActiveProgrammeId()
    const { data: projets = [] } = useGetProjets()

    // ✅ Utiliser projets.length pour simuler les données
    const nbProjets = projets.length

    // ── Données fictives pour Carte 2 : PTBA Programme ──
    const ptbaProgrammeData = useMemo(() => {
        const montantPrevu = nbProjets * 1_200_000
        const montantDecaisse = nbProjets * 540_000
        const activitesRealisees = nbProjets * 2
        const totalActivites = nbProjets * 5
        const annee = new Date().getFullYear()

        return {
            montantPrevu,
            montantDecaisse,
            activitesRealisees,
            totalActivites,
            annee,
        }
    }, [nbProjets])

    // ── Données fictives pour Carte 3 : PAO Département ──
    const ptbaDepartementData = useMemo(() => {
        // ✅ Données différentes : plus petites pour le département
        const montantPrevu = nbProjets * 800_000
        const montantDecaisse = nbProjets * 320_000
        const activitesRealisees = nbProjets * 1
        const totalActivites = nbProjets * 4
        const annee = new Date().getFullYear()

        return {
            montantPrevu,
            montantDecaisse,
            activitesRealisees,
            totalActivites,
            annee,
        }
    }, [nbProjets])

    // ── Calculs pour Carte 2 ──
    const ptbaTauxDecaissement = useMemo(() => {
        if (ptbaProgrammeData.montantPrevu === 0) return 0
        return Math.round((ptbaProgrammeData.montantDecaisse / ptbaProgrammeData.montantPrevu) * 100)
    }, [ptbaProgrammeData.montantDecaisse, ptbaProgrammeData.montantPrevu])

    const ptbaPourcentageRealisation = useMemo(() => {
        if (ptbaProgrammeData.totalActivites === 0) return 0
        return Math.round((ptbaProgrammeData.activitesRealisees / ptbaProgrammeData.totalActivites) * 100)
    }, [ptbaProgrammeData.activitesRealisees, ptbaProgrammeData.totalActivites])

    // ── Calculs pour Carte 3 ──
    const departementTauxDecaissement = useMemo(() => {
        if (ptbaDepartementData.montantPrevu === 0) return 0
        return Math.round((ptbaDepartementData.montantDecaisse / ptbaDepartementData.montantPrevu) * 100)
    }, [ptbaDepartementData.montantDecaisse, ptbaDepartementData.montantPrevu])

    const departementPourcentageRealisation = useMemo(() => {
        if (ptbaDepartementData.totalActivites === 0) return 0
        return Math.round((ptbaDepartementData.activitesRealisees / ptbaDepartementData.totalActivites) * 100)
    }, [ptbaDepartementData.activitesRealisees, ptbaDepartementData.totalActivites])

    // ── Données tableau projets ───────────────────────────────────────────────────
    const projetRows: ProjetRow[] = useMemo(() => {
        const aujourdhui = new Date()

        return projets.map((p: any) => {
            const dateDebut = new Date(p.date_demarrage_projet)
            const dureeAnnees = p.duree_projet || 2
            const dateCloture = new Date(dateDebut)
            dateCloture.setFullYear(dateDebut.getFullYear() + dureeAnnees)

            const dateClotureMs = dateCloture.getTime()
            const aujourdhuiMs = aujourdhui.getTime()
            const delaiConsomme =
                dateClotureMs > aujourdhuiMs
                    ? Math.round(
                        ((aujourdhuiMs - dateDebut.getTime()) /
                            (dateClotureMs - dateDebut.getTime())) *
                        100
                    )
                    : 100

            let statut: ProjetRow['statut'] = 'actif'
            const avancement = p.taux_avancement_technique ?? 60
            const isClotureDepassee = dateCloture < aujourdhui

            if (isClotureDepassee && avancement < 100) {
                statut = 'retard'
            } else if (avancement < 30 && delaiConsomme > 70) {
                statut = 'critique'
            } else if (isClotureDepassee && avancement >= 100) {
                statut = 'clôturé'
            } else if (p.statut_projet?.toLowerCase() === 'suspendu') {
                statut = 'suspendu'
            }

            const partenairesExecution = p.signataires_projet || []
            const partenairesNoms = partenairesExecution
                .map((partenaire: any) => partenaire.code_acteur?.trim())
                .filter(Boolean)

            return {
                id: p.id_projet ?? p.id,
                sigle: p.sigle_projet ?? p.sigle ?? '—',
                nom_projet: p.intitule_projet ?? p.titre ?? '—',
                logo: p.logo_projet,
                date_demarrage: p.date_demarrage_projet ?? p.date_debut ?? '',
                date_cloture: dateCloture.toISOString().split('T')[0],
                delai_consomme: delaiConsomme,
                budget_prevu: Number(p.budget_prevu ?? p.montant_prevu ?? 1000000),
                montant_decaisse: Number(p.montant_decaisse ?? 450000),
                taux_decaissement: Number(p.taux_decaissement ?? 45),
                taux_avancement_technique: avancement,
                bailleur: partenairesNoms.join('/ ') || '—',
                statut,
            }
        })
    }, [projets])

    const projetRowsFiltered = useMemo(() => {
        if (!searchQuery.trim()) return projetRows
        const q = searchQuery.toLowerCase()
        return projetRows.filter(
            (r) =>
                r.sigle.toLowerCase().includes(q) ||
                r.nom_projet.toLowerCase().includes(q) ||
                (r.bailleur && r.bailleur.toLowerCase().includes(q))
        )
    }, [projetRows, searchQuery])

    // ── Carte 1 : Projet Programme ──
    const { data: projectsPerType = [] } = useCountProjectsPerType(idProgramme || 0)
    const projetProgrammeStats = useMemo(() => {
        const totalProjets = projets.length
        const aujourdhui = new Date()
        const projetsEnRetard = projets.filter((p) => {
            if (!p.date_demarrage_projet) return false
            const dateDebut = new Date(p.date_demarrage_projet)
            const dureeMois = p.duree_projet * 12
            const dateFinPrevue = new Date(
                dateDebut.setMonth(dateDebut.getMonth() + dureeMois)
            )
            return dateFinPrevue < aujourdhui
        }).length

        const projetsCritiques = Math.floor(projets.length * 0.25)
        const pourcentageRetard = totalProjets > 0 ? Math.round((projetsEnRetard / totalProjets) * 100) : 0
        const pourcentageCritique = totalProjets > 0 ? Math.round((projetsCritiques / totalProjets) * 100) : 0

        return {
            total: totalProjets,
            enRetard: projetsEnRetard,
            pourcentageRetard,
            critiques: projetsCritiques,
            pourcentageCritique,
        }
    }, [projets])

    const projetsEnCours = projetProgrammeStats.total - (projetProgrammeStats.critiques + projetProgrammeStats.enRetard)
    const pourcentageEnCours = projetProgrammeStats.total > 0
        ? Math.round((projetsEnCours / projetProgrammeStats.total) * 100)
        : 0

    const TAG_COLORS = [
        { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200' },
        { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
        { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
        { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
        { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
        { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
    ]

    return (
        <div className='min-h-screen space-y-3 bg-gray-50 p-2 dark:bg-gray-950'>
            <DashboardHeader
                nomProgramme={`Programme ${codeProgramme || 'Demo'}`}
                onSearchProject={setSearchQuery}
            />

            <div className='grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4'>
                {/* Carte 1 : Projets et Programmes */}
                <StatCard
                    title='Projets et Programmes'
                    color='blue'
                    rows={[
                        { label: 'Nombre total de projets', value: projetProgrammeStats.total },
                        { label: 'Projets en cours', value: projetsEnCours, suffix: `(${pourcentageEnCours}%)`, valueColor: 'emerald' },
                        {
                            label: 'Retard / Critique',
                            value: `${projetProgrammeStats.enRetard} (${projetProgrammeStats.pourcentageRetard}%) / ${projetProgrammeStats.critiques} (${projetProgrammeStats.pourcentageCritique}%)`
                        },
                    ]}
                    tags={projectsPerType.map((ppt, index) => ({
                        label: ppt.code_type_projet,
                        value: ppt.nombre_projets,
                        color: TAG_COLORS[index % TAG_COLORS.length],
                    }))}
                />

                {/* Carte 2 : PTBA Programme - Données 1 */}
                <StatCard
                    title={`PTBA ${ptbaProgrammeData.annee} des Projets/Programmes`}
                    color='emerald'
                    rows={[
                        { label: 'Montant Total Prévu', value: ptbaProgrammeData.montantPrevu.toLocaleString('fr-FR'), suffix: 'GNF' },
                        { label: 'Montant Total Décaissé', value: ptbaProgrammeData.montantDecaisse.toLocaleString('fr-FR'), suffix: `(${ptbaTauxDecaissement}%) GNF`, valueColor: 'emerald' },
                        { label: "Nombre Total d'activité réalisée", value: ptbaProgrammeData.activitesRealisees, suffix: `(${ptbaPourcentageRealisation}%)`, valueColor: 'emerald' },
                    ]}
                    progressValue={ptbaTauxDecaissement}
                    progressColor='emerald'
                />

                {/* Carte 3 : PAO Département - Données 2 (différentes) */}
                <StatCard
                    title={`PAO ${ptbaDepartementData.annee} du MINAGRI`}
                    color='purple'
                    rows={[
                        { label: 'Montant Total Prévu', value: ptbaDepartementData.montantPrevu.toLocaleString('fr-FR'), suffix: 'GNF' },
                        { label: 'Montant Total Décaissé', value: ptbaDepartementData.montantDecaisse.toLocaleString('fr-FR'), suffix: `(${departementTauxDecaissement}%) GNF`, valueColor: 'purple' },
                        { label: "Nombre Total d'activité réalisée", value: ptbaDepartementData.activitesRealisees, suffix: `(${departementPourcentageRealisation}%)`, valueColor: 'purple' },
                    ]}
                    progressValue={departementTauxDecaissement}
                    progressColor='purple'
                />

                {/* Carte 4 : Points de blocage */}
                <StatCard
                    title='Points de blocage'
                    color='rose'
                    rows={[
                        { label: 'Nombre Total', value: projets.length * 12 },
                        { label: 'Total point de blocage résolu', value: Math.floor(projets.length * 12 * 0.51), suffix: '(51%)', valueColor: 'emerald' },
                        { label: 'Total point de blocage non résolu', value: Math.floor(projets.length * 12 * 0.49), suffix: '(49%)', valueColor: 'red' },
                    ]}
                    progressValue={51}
                    progressColor='emerald'
                />
            </div>

            <ProjectTable
                projets={projetRowsFiltered}
                pageSize={10}
                onProjetClick={(p) => {
                    console.log('Naviguer vers projet', p.id)
                }}
            />
        </div>
    )
}

export default DashboardPage