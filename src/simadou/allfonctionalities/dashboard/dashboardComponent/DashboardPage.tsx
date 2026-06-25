import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useGetProjets } from '@/simadou/allHooks/admin/projetHooks'
import { useCountProjectsPerType } from '@/simadou/allHooks/admin/typeProjetHooks'
import {
    useActiveProgrammeCode,
    useActiveProgrammeId,
} from '@/hooks/use-active-programme'
import DashboardHeader from './DashboardHeader'
import ProjectTable, { type ProjetRow } from './ProjectTable'
import StatCard from './StatCard'
import { useGetVersions } from '@/simadou/allHooks/admin/versionHooks'
import { useGetAvancementDirections } from '@/simadou/allHooks/admin/dashboardProgrammeHooks'
import AvancementDirectionChart from './AvancementDirectionChart'


// ─── Dashboard principal ───────────────────────────────────────────────────────
const DashboardPage: React.FC = () => {
    // Filtres par année pour les différents graphiques
    const [searchQuery, setSearchQuery] = useState('')

    const codeProgramme = useActiveProgrammeCode()
    const idProgramme = useActiveProgrammeId()
    const { data: projets = [] } = useGetProjets()
    const { data: avancement_directions = [] } = useGetAvancementDirections()


    // ── Données tableau projets ───────────────────────────────────────────────────
    const projetRows: ProjetRow[] = useMemo(() => {
        const aujourdhui = new Date()

        return projets.map((p: any) => {
            // Calcul de la date de clôture : date_demarrage + duree (en années)
            const dateDebut = new Date(p.date_demarrage_projet)
            const dureeAnnees = p.duree_projet || 2
            const dateCloture = new Date(dateDebut)
            dateCloture.setFullYear(dateDebut.getFullYear() + dureeAnnees)

            // Calcul du délai consommé
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

            // Détermination du statut
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

            // Récupérer les partenaires d'exécution
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
                bailleur: partenairesNoms.join('/ ') || '—', // Affichage des partenaires d'exécution
                statut,
            }
        })
    }, [projets])

    // Filtrage par recherche globale
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

    // Données pour la carte 1 : Projet Programme
    const { data: projectsPerType = [] } = useCountProjectsPerType(idProgramme || 0)
    const projetProgrammeStats = useMemo(() => {
        const totalProjets = projets.length // ← Tes 4 projets réels

        // Projets en retard : date_demarrage_projet > date_prevue ou date_cloture dépassée
        // Comme tes projets n'ont pas de date_cloture, on utilise date_demarrage + duree
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

        // Projets critiques : (données fictives car pas dans ton API)
        const projetsCritiques = Math.floor(projets.length * 0.25) // 25% fictif

        const pourcentageRetard =
            totalProjets > 0 ? Math.round((projetsEnRetard / totalProjets) * 100) : 0
        const pourcentageCritique =
            totalProjets > 0 ? Math.round((projetsCritiques / totalProjets) * 100) : 0

        return {
            total: totalProjets,
            enRetard: projetsEnRetard,
            pourcentageRetard,
            critiques: projetsCritiques,
            pourcentageCritique,
        }
    }, [projets])

    // Données pour la carte 2 : PAO Programme (avec données fictives pour montants)
    const notifications = useMemo(
        () => [
            {
                id: 1,
                message: `$n retard nécessitent votre attention`,
                type: 'warning' as const,
                time: 'Maintenant',
                lu: false,
            },
            {
                id: 2,
                message: 'Rapport mensuel disponible pour téléchargement',
                type: 'info' as const,
                time: 'Il y a 2h',
                lu: false,
            },
            {
                id: 3,
                message: 'Sprint Q2 terminé avec succès',
                type: 'success' as const,
                time: 'Hier',
                lu: true,
            },
        ],
        [9]
    )
        // ✅ Utiliser toutes les versions (sans filtre programme)
    const { data: versions = [] } = useGetVersions()

    // ✅ Extraire les années disponibles à partir de toutes les versions
    const anneesDisponibles = useMemo(() => {
        if (!versions || versions.length === 0) return []

        // Récupérer toutes les années
        const annees = versions.map((v) => v.annee_ptba)

        // Dédoublonner et trier par ordre décroissant (plus récent en premier)
        return [...new Set(annees)].sort((a, b) => b - a)
    }, [versions])

    // ✅ Pour chaque année, trouver la version avec la date de validation la plus récente
    const versionsParAnnee = useMemo(() => {
        if (!versions || versions.length === 0) return new Map()

        const map = new Map<number, typeof versions[0]>()

        versions.forEach((version) => {
            const annee = version.annee_ptba
            const dateValidation = version.date_validation
                ? new Date(version.date_validation).getTime()
                : 0

            if (!map.has(annee)) {
                map.set(annee, version)
            } else {
                const existing = map.get(annee)!
                const existingDate = existing.date_validation
                    ? new Date(existing.date_validation).getTime()
                    : 0

                if (dateValidation > existingDate) {
                    map.set(annee, version)
                }
            }
        })

        return map
    }, [versions])
    
    // ✅ Récupérer la version la plus récente pour une année donnée
    const getVersionByAnnee = useCallback((annee: number) => {
        return versionsParAnnee.get(annee) || null
    }, [versionsParAnnee])

    // ✅ Année par défaut (la plus récente)
    const [anneeTaches, setAnneeTaches] = useState<number>(
        anneesDisponibles.length > 0 ? anneesDisponibles[0] : new Date().getFullYear()
    )

    // ✅ Mettre à jour la version sélectionnée quand l'année change
    useEffect(() => {
        if (anneeTaches) {
            const version = getVersionByAnnee(anneeTaches)
            if (version) {
                // Vous pouvez stocker l'ID de la version si nécessaire
                console.log('Version sélectionnée pour l\'année', anneeTaches, version.id_version_ptba)
            }
        }
    }, [anneeTaches, getVersionByAnnee])
    // Données pour la carte 4 : Points de blocage (fictives car pas dans ton API)
    const pointsBlocageStats = useMemo(() => {
        // Données fictives basées sur le nombre de projets
        const totalPoints = projets.length * 12 // 12 points par projet
        const pointsResolus = Math.floor(totalPoints * 0.51)
        const pointsNonResolus = totalPoints - pointsResolus
        const pourcentageResolus = Math.round((pointsResolus / totalPoints) * 100)
        const pourcentageNonResolus = Math.round(
            (pointsNonResolus / totalPoints) * 100
        )

        return {
            total: totalPoints,
            resolus: pointsResolus,
            nonResolus: pointsNonResolus,
            pourcentageResolus,
            pourcentageNonResolus,
        }
    }, [projets])
    const TAG_COLORS = [
        { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200' },
        { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
        { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
        { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
        { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
        { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
    ]
    const projetsEnCours = projetProgrammeStats.total - (projetProgrammeStats.critiques + projetProgrammeStats.enRetard)
    const pourcentageEnCours = projetProgrammeStats.total > 0
        ? Math.round((projetsEnCours / projetProgrammeStats.total) * 100)
        : 0
    // ── Render ────────────────────────────────────────────────────────────────────
    return (
        <div className='min-h-screen space-y-3 bg-gray-50 p-2 dark:bg-gray-950'>
            {/* En-tête */}
            <DashboardHeader
                nomProgramme={`Programme ${codeProgramme || 'Demo'}`}
                notifications={notifications}
                onSearchProject={setSearchQuery}
            />

            {/* ── Cartes statistiques ── */}
            <div className='grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4'>
                {/* Carte 1 : Projet Programme */}
                {/* Carte 1 : Projet Programme */}
                <StatCard
                    title='Projets et Programmes'
                    color='blue'
                    rows={[
                        { label: 'Nombre total de projets', value: projetProgrammeStats.total },
                        { label: 'Projets en cours', value: projetsEnCours, suffix: `(${pourcentageEnCours}%)`, valueColor: 'emerald' },
                        {
                            label: `Retard ${projetProgrammeStats.enRetard} (${projetProgrammeStats.pourcentageRetard}%) / Critique ${projetProgrammeStats.critiques} (${projetProgrammeStats.pourcentageCritique}%)`,
                        },
                    ]}
                    tags={projectsPerType.map((ppt, index) => ({
                        label: ppt.code_type_projet,
                        value: ppt.nombre_projets,
                        color: TAG_COLORS[index % TAG_COLORS.length],
                    }))}
                />

                {/* Carte 2 : PAO Programme */}
                <StatCard
                    title={`PTBA 2025 des Projets/Programmes`}
                    color='emerald'
                    rows={[
                        {
                            label: 'Montant Total Prévu',
                            value: 8000000,
                            suffix: 'GNF',
                        },
                        {
                            label: 'Montant Total Décaissé',
                            value: 900000000,
                            suffix: `(60%) GNF`,
                            valueColor: 'emerald',
                        },
                        {
                            label: "Nombre Total d'activité réalisée",
                            value: 9,
                            suffix: `(54%)`,
                            valueColor: 'emerald',
                        },
                    ]}
                    progressValue={90}
                    progressColor='emerald'
                />

                {/* Carte 3 : PAO Département */}
                <StatCard
                    title={`PAO 2026 du MINAGRI`}
                    color='purple'
                    rows={[
                        {
                            label: 'Montant Total Prévu',
                            value: 79,
                            suffix: 'GNF',
                        },
                        {
                            label: 'Montant Total Décaissé',
                            value:
                                78,
                            suffix: `(49%) GNF`,
                            valueColor: 'purple',
                        },
                        {
                            label: "Nombre Total d'activité réalisée",
                            value: 900000,
                            suffix: `(90%)`,
                            valueColor: 'purple',
                        },
                    ]}
                    progressValue={90}
                    progressColor='purple'
                />

                {/* Carte 4 : Points de blocage */}
                <StatCard
                    title='Points de blocage'
                    color='rose'
                    rows={[
                        { label: 'Nombre Total', value: pointsBlocageStats.total },
                        {
                            label: 'Total point de blocage résolu',
                            value: pointsBlocageStats.resolus,
                            suffix: `(${pointsBlocageStats.pourcentageResolus}%)`,
                            valueColor: 'emerald',
                        },
                        {
                            label: 'Total point de blocage non résolu',
                            value: pointsBlocageStats.nonResolus,
                            suffix: `(${pointsBlocageStats.pourcentageNonResolus}%)`,
                            valueColor: 'red',
                        },
                    ]}
                    progressValue={pointsBlocageStats.pourcentageResolus}
                    progressColor='emerald'
                />
            </div>

            {/* ── Tableau des projets ── */}
            <ProjectTable
                projets={projetRowsFiltered}
                pageSize={10}
                onProjetClick={(p) => {
                    console.log('Naviguer vers projet', p.id)
                }}
            />


            {/* ── Graphiques ligne 2 : Avancement par service ── */}
            <div className='grid grid-cols-1 gap-2 lg:grid-cols-2'>
                {/* <AvancementServiceChart
                    data={avancementTaches}
                    mode='pourcentage'
                    anneesDisponibles={anneesDisponibles}
                    selectedAnnee={anneeTaches}
                    onAnneeChange={setAnneeTaches}
                    title='Avancement des tâches par service (Top 10)'
                    subtitle='Taux de réalisation par direction'
                />*/}
                <AvancementDirectionChart
                    data={avancement_directions}
                    mode='detail'
                    anneesDisponibles={anneesDisponibles}
                    selectedAnnee={anneeTaches}
                    onAnneeChange={setAnneeTaches}
                    title='Avancement des Taches par Unite de Gestion'
                />
            </div> 

        </div>
    )
}

export default DashboardPage
