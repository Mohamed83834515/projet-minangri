import React, { useMemo, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
import {
    ClipboardListIcon,
    CheckCircle2Icon,
    TrendingUpIcon,
    AlertCircleIcon,
    // CoinsIcon,
    // UsersIcon,
} from "lucide-react";
import { PlanSite, Projet, Ptba, TacheActivitePtba, VersionPtba } from "@/simadou/allTypes";
import ProjectTable, { ProjetRow } from "./ProjectTable";
import DashboardHeader from "./DashboardHeader";
import StatCard from "./StatCard";
import PTBAComposanteChart from "./PTBAComposanteChart";
import RealisationCiblesChart from "./RealisationCiblesChart";
import AvancementServiceChart from "./AvancementServiceChart";
import DecaissementCharts from "./DecaissementCharts";
import RecapitulatifTable from "./RecapitulatifTable";
import { useActiveProgrammeCode, useActiveProgrammeId } from "@/hooks/use-active-programme";
import { projetService } from "@/simadou/allSercices/projetService";
import { useQuery } from "@tanstack/react-query";
// import { projetService } from "@/simadou/allSercices/projetService";
// import tacheActivitePtbaService from "@/simadou/allSercices/tacheActivitePtbaService";
// import ptbaService from "@/simadou/allSercices/ptbaService";
// import versionPtbaService from "@/simadou/allSercices/versionPtbaService";
// import { planSiteService } from "@/simadou/allSercices/planSiteService";
// import { decaissementPtbaService } from "@/simadou/allSercices/decaissementPtbaService";

// ─── DONNÉES FICTIVES ────────────────────────────────────────────────────────────

// const FICTIVE_PROJETS: Projet[] = [
//     {
//         id_projet: 1,
//         code_projet: "P001",
//         sigle_projet: "AGR",
//         intitule_projet: "Projet Agricole Intégré",
//         duree_projet: 36,
//         date_signature_projet: "2024-01-10",
//         date_demarrage_projet: "2024-02-01",
//         programme_projet: { id_programme: 1, code_programme: "PG_AGR", sigle_programme: "AGR", nom_programme: "Programme Agricole", vision_programme: "", objectif_programme: "", annee_debut_programme: "2024", annee_fin_programme: "2027", actif_programme: true, id_nbc_programme: null },
//         partenaire_projet: undefined,
//         structure_projet: [],
//         signataires_projet: [],
//         partenaires_execution_projet: [],
//         zone_projet: [],
//     },
//     {
//         id_projet: 2,
//         code_projet: "P002",
//         sigle_projet: "INFRA",
//         intitule_projet: "Projet Infrastructures Rurales",
//         duree_projet: 48,
//         date_signature_projet: "2024-02-15",
//         date_demarrage_projet: "2024-03-01",
//         programme_projet: { id_programme: 1, code_programme: "PG_AGR", sigle_programme: "AGR", nom_programme: "Programme Agricole", vision_programme: "", objectif_programme: "", annee_debut_programme: "2024", annee_fin_programme: "2027", actif_programme: true, id_nbc_programme: null },
//         partenaire_projet: undefined,
//         structure_projet: [],
//         signataires_projet: [],
//         partenaires_execution_projet: [],
//         zone_projet: [],
//     },
//     {
//         id_projet: 3,
//         code_projet: "P003",
//         sigle_projet: "FORM",
//         intitule_projet: "Projet Formation Professionnelle",
//         duree_projet: 24,
//         date_signature_projet: "2024-03-20",
//         date_demarrage_projet: "2024-04-01",
//         programme_projet: { id_programme: 1, code_programme: "PG_AGR", sigle_programme: "AGR", nom_programme: "Programme Agricole", vision_programme: "", objectif_programme: "", annee_debut_programme: "2024", annee_fin_programme: "2027", actif_programme: true, id_nbc_programme: null },
//         partenaire_projet: undefined,
//         structure_projet: [],
//         signataires_projet: [],
//         partenaires_execution_projet: [],
//         zone_projet: [],
//     },
// ];

const FICTIVE_ACTIVITES: Ptba[] = [
    { id_ptba: 1, localites_ptba: [], partenaire_conserne_ptba: [], code_activite_ptba: "ACT001", intitule_activite_ptba: "Formation des agriculteurs", chronogramme: "2024", statut_activite: "En cours", version_ptba: 1, type_activite: "Formation", composante_ptba: "Composante A", taux_avancement_technique: 75, taux_indicateurs: 80, taux_decaissement: 60 },
    { id_ptba: 2, localites_ptba: [], partenaire_conserne_ptba: [], code_activite_ptba: "ACT002", intitule_activite_ptba: "Construction de pistes rurales", chronogramme: "2024", statut_activite: "En cours", version_ptba: 1, type_activite: "Infrastructure", composante_ptba: "Composante B", taux_avancement_technique: 45, taux_indicateurs: 50, taux_decaissement: 40 },
    { id_ptba: 3, localites_ptba: [], partenaire_conserne_ptba: [], code_activite_ptba: "ACT003", intitule_activite_ptba: "Distribution d'intrants", chronogramme: "2024", statut_activite: "Terminé", version_ptba: 2, type_activite: "Logistique", composante_ptba: "Composante A", taux_avancement_technique: 100, taux_indicateurs: 95, taux_decaissement: 90 },
    { id_ptba: 4, localites_ptba: [], partenaire_conserne_ptba: [], code_activite_ptba: "ACT004", intitule_activite_ptba: "Suivi-évaluation", chronogramme: "2025", statut_activite: "Planifié", version_ptba: 2, type_activite: "Management", composante_ptba: "Composante C", taux_avancement_technique: 10, taux_indicateurs: 15, taux_decaissement: 5 },
];

const FICTIVE_TACHES: TacheActivitePtba[] = [
    { id_groupe_tache: 1, intutile_tache_gt: "Planification", proportion_gt: "10%", code_tache_gt: "T001", date_debut_gt: "2024-01-01", date_fin_gt: "2024-01-31", date_reelle_gt: "2024-01-30", n_lot_gt: 101, valider_gt: "Validé", livrable_gt: "Plan", id_activite: 1, observation_gt: "", id_personnel_gt: 1, responsable_gt: 1 },
    { id_groupe_tache: 2, intutile_tache_gt: "Exécution terrain", proportion_gt: "50%", code_tache_gt: "T002", date_debut_gt: "2024-02-01", date_fin_gt: "2024-06-30", date_reelle_gt: "", n_lot_gt: 102, valider_gt: "En cours", livrable_gt: "Rapport", id_activite: 1, observation_gt: "", id_personnel_gt: 2, responsable_gt: 2 },
    { id_groupe_tache: 3, intutile_tache_gt: "Rapport final", proportion_gt: "40%", code_tache_gt: "T003", date_debut_gt: "2024-07-01", date_fin_gt: "2024-08-31", date_reelle_gt: "", n_lot_gt: 103, valider_gt: "En cours", livrable_gt: "Rapport", id_activite: 1, observation_gt: "", id_personnel_gt: 1, responsable_gt: 1 },
    { id_groupe_tache: 4, intutile_tache_gt: "Étude de sol", proportion_gt: "30%", code_tache_gt: "T004", date_debut_gt: "2024-03-01", date_fin_gt: "2024-04-30", date_reelle_gt: "", n_lot_gt: 201, valider_gt: "Validé", livrable_gt: "Étude", id_activite: 2, observation_gt: "", id_personnel_gt: 3, responsable_gt: 3 },
    { id_groupe_tache: 5, intutile_tache_gt: "Construction", proportion_gt: "70%", code_tache_gt: "T005", date_debut_gt: "2024-05-01", date_fin_gt: "2024-12-31", date_reelle_gt: "", n_lot_gt: 202, valider_gt: "En cours", livrable_gt: "Infrastructure", id_activite: 2, observation_gt: "", id_personnel_gt: 4, responsable_gt: 4 },
];

const FICTIVE_VERSIONS: VersionPtba[] = [
    { id_version_ptba: 1, annee_ptba: 2024, taux_realisation: 65, taux_cible: 70, statut_version: 0, created_at: "", updated_at: "" },
    { id_version_ptba: 2, annee_ptba: 2025, taux_realisation: 25, taux_cible: 40, statut_version: 1, created_at: "", updated_at: "" },
];

const FICTIVE_PLANS_SITES: PlanSite[] = [
    { id_ds: 101, code_ds: "DS001", intutile_ds: "Direction de l'Agriculture", niveau_ds: 1, parent_ds: 0, code_relai_ds: "REL001" },
    { id_ds: 102, code_ds: "DS002", intutile_ds: "Direction des Infrastructures", niveau_ds: 1, parent_ds: 0, code_relai_ds: "REL002" },
    { id_ds: 103, code_ds: "DS003", intutile_ds: "Direction de la Formation", niveau_ds: 1, parent_ds: 0, code_relai_ds: "REL003" },
];

const FICTIVE_DECAISSEMENTS = [
    { bailleur: "BAD", valeur_decaissement_ptba: 150000, montant_prevu_ptba: 200000, date_decaissement_ptba: "2024-01-15", id_ptba: { id_programme: 1 } },
    { bailleur: "BM", valeur_decaissement_ptba: 250000, montant_prevu_ptba: 300000, date_decaissement_ptba: "2024-02-20", id_ptba: { id_programme: 1 } },
    { bailleur: "UE", valeur_decaissement_ptba: 100000, montant_prevu_ptba: 150000, date_decaissement_ptba: "2024-03-10", id_ptba: { id_programme: 1 } },
    { bailleur: "BAD", valeur_decaissement_ptba: 80000, montant_prevu_ptba: 100000, date_decaissement_ptba: "2024-04-05", id_ptba: { id_programme: 1 } },
];

// ─── Types internes ────────────────────────────────────────────────────────────
interface ExecutionComposante {
    composante: string;
    avancement_technique: number;
    indicateurs: number;
    decaissement: number;
}

interface ServiceData {
    service: string;
    tachesTerminees: number;
    tachesTotal: number;
    pourcentage: number;
}

// ─── Dashboard principal ───────────────────────────────────────────────────────
const DashboardPage: React.FC = () => {
    // Filtres par année pour les différents graphiques
    const [anneeComposante, setAnneeComposante] = useState<number | null>(null);
    const [anneeTaches, setAnneeTaches] = useState<number | null>(null);
    const [anneeIndicateurs, setAnneIndicateurs] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const codeProgramme = useActiveProgrammeCode();
    const idProgramme = useActiveProgrammeId();

    // ── COMMENTÉ : Queries API réelles ──
    // const { data: activites = [], isLoading: loadingActivites } = useQuery<Ptba[]>({
    //     queryKey: ["ptba-activites-dashboard", codeProgramme],
    //     queryFn: () => ptbaService.getAll(codeProgramme || ""),
    //     enabled: !!codeProgramme,
    // });

    // const { data: taches = [], isLoading: loadingTaches } = useQuery<TacheActivitePtba[]>({
    //     queryKey: ["taches-dashboard"],
    //     queryFn: tacheActivitePtbaService.getAll,
    // });

    // const { data: projets = [], isLoading: loadingProjects } = useQuery<Projet[]>({
    //     queryKey: ["projects-dashboard"],
    //     queryFn: async () => {
    //         const all = await projetService.getAll();
    //         return all.filter(
    //             (p: Projet) =>
    //                 p.programme_projet !== null &&
    //                 typeof p.programme_projet === 'object' &&
    //                 p.programme_projet?.code_programme === codeProgramme
    //         )
    //     },
    //     enabled: !!codeProgramme,
    // });

    // const { data: versions = [], isLoading: loadingVersions } = useQuery<VersionPtba[]>({
    //     queryKey: ["versions-ptba-dashboard"],
    //     queryFn: versionPtbaService.getAll,
    // });

    // const { data: plansSites = [], isLoading: loadingPlansSites } = useQuery<PlanSite[]>({
    //     queryKey: ["plans-sites-dashboard"],
    //     queryFn: planSiteService.getAll,
    // });

    // const { data: decaissements = [], isLoading: loadingDecaissements } = useQuery({
    //     queryKey: ["decaissementsPtba"],
    //     queryFn: () => decaissementPtbaService.getAll(),
    // });

    // ── DONNÉES FICTIVES (remplacement temporaire) ──
    const activites = FICTIVE_ACTIVITES;
    const taches = FICTIVE_TACHES;
    const { data: projets = []} = useQuery<Projet[]>({
        queryKey: ["projects-dashboard"],
        queryFn: async () => {
            const all = await projetService.getAll();
            return all.filter(
                (p: Projet) =>
                    p.programme_projet !== null &&
                    typeof p.programme_projet === 'object' &&
                    p.programme_projet?.code_programme === codeProgramme
            )
        },
        enabled: !!codeProgramme,
    });
    // const projets = FICTIVE_PROJETS.filter(
    //     (p: Projet) =>
    //         p.programme_projet !== null &&
    //         typeof p.programme_projet === 'object' &&
    //         p.programme_projet?.code_programme === codeProgramme
    // );
    const versions = FICTIVE_VERSIONS;
    const plansSites = FICTIVE_PLANS_SITES;
    const decaissements = FICTIVE_DECAISSEMENTS;

    // const isLoading = false; // Désactivé pour les données fictives

    // ── Années disponibles ────────────────────────────────────────────────────────
    const anneesDisponibles = useMemo(
        () =>
            [...new Set(versions.map((v) => v.annee_ptba))].sort((a, b) => b - a),
        [versions]
    );

    // ── Helpers de filtrage ───────────────────────────────────────────────────────
    const filtrerActivitesParAnnee = (annee: number | null) => {
        if (!annee) return activites;
        const ids = versions
            .filter((v) => v.annee_ptba === annee)
            .map((v) => v.id_version_ptba);
        return activites.filter((a) => ids.includes(a.version_ptba));
    };

    const filtrerTaches = (acts: Ptba[]) => {
        const ids = acts.map((a) => a.id_ptba);
        return taches.filter((t) => ids.includes(Number(t.id_activite)));
    };

    // ── Stats globales ────────────────────────────────────────────────────────────
    const stats = useMemo(() => {
        const total = taches.length;
        const validees = taches.filter(
            (t) =>
                t.valider_gt?.toLowerCase() === "validé" ||
                t.valider_gt?.toLowerCase() === "valide"
        ).length;
        const enCours = taches.filter(
            (t) => t.valider_gt?.toLowerCase() === "en cours"
        ).length;
        const enRetard = taches.filter((t) => {
            if (!t.date_fin_gt) return false;
            return (
                new Date(t.date_fin_gt) < new Date() &&
                t.valider_gt?.toLowerCase() !== "validé"
            );
        }).length;
        const taux = total > 0 ? ((validees / total) * 100).toFixed(1) : "0";

        return {
            totalProjets: projets.length,
            validees,
            enCours,
            enRetard,
            taux,
            totalTaches: total,
        };
    }, [taches, projets]);

    // ── Données tableau projets ───────────────────────────────────────────────────
    const projetRows: ProjetRow[] = useMemo(() => {
        return projets.map((p: any) => ({
            id: p.id_projet ?? p.id,
            sigle: p.sigle_projet ?? p.sigle ?? "—",
            nom_projet: p.intitule_projet ?? p.titre ?? "—",
            logo: p.logo_projet,
            date_demarrage: p.date_demarrage_projet ?? p.date_debut ?? "",
            date_cloture: p.date_cloture_projet ?? p.date_fin ?? "",
            budget_prevu: Number(p.budget_prevu ?? p.montant_prevu ?? 1000000),
            montant_decaisse: Number(p.montant_decaisse ?? 450000),
            taux_decaissement: Number(p.taux_decaissement ?? 45),
            taux_avancement_technique: Number(p.taux_avancement_technique ?? p.taux_avancement ?? 60),
            delai_consomme: Number(p.delai_consomme ?? 30),
            bailleur: p.bailleur_projet ?? p.bailleur ?? "BAD",
            statut: (p.statut_projet?.toLowerCase() ?? "actif") as ProjetRow["statut"],
        }));
    }, [projets]);

    // Filtrage par recherche globale
    const projetRowsFiltered = useMemo(() => {
        if (!searchQuery.trim()) return projetRows;
        const q = searchQuery.toLowerCase();
        return projetRows.filter(
            (r) =>
                r.sigle.toLowerCase().includes(q) ||
                r.nom_projet.toLowerCase().includes(q) ||
                (r.bailleur && r.bailleur.toLowerCase().includes(q))
        );
    }, [projetRows, searchQuery]);

    // ── Données graphique composantes ─────────────────────────────────────────────
    const composanteData: ExecutionComposante[] = useMemo(() => {
        const acts = filtrerActivitesParAnnee(anneeComposante);
        const composanteMap: Record<string, { avt: number; ind: number; dec: number; total: number }> = {};

        acts.forEach((a) => {
            const comp: string = (a as any).composante_ptba ?? `Composante ${a.id_ptba ?? "—"}`;

            if (!composanteMap[comp]) {
                composanteMap[comp] = { avt: 0, ind: 0, dec: 0, total: 0 };
            }

            composanteMap[comp].total += 1;
            composanteMap[comp].avt += Number((a as any).taux_avancement_technique ?? 0);
            composanteMap[comp].ind += Number((a as any).taux_indicateurs ?? 0);
            composanteMap[comp].dec += Number((a as any).taux_decaissement ?? 0);
        });

        return Object.entries(composanteMap).map(([comp, d]) => ({
            composante: comp,
            avancement_technique: d.total > 0 ? Math.round(d.avt / d.total) : 0,
            indicateurs: d.total > 0 ? Math.round(d.ind / d.total) : 0,
            decaissement: d.total > 0 ? Math.round(d.dec / d.total) : 0,
        }));
    }, [activites, versions, anneeComposante]);

    // ── Réalisation vs Cibles (par année) ────────────────────────────────────────
    const realisationCiblesData = useMemo(() => {
        const anneeMap: Record<string, { realisation: number; cibles: number; count: number }> = {};
        versions.forEach((v) => {
            const yr = String(v.annee_ptba);
            if (!anneeMap[yr]) anneeMap[yr] = { realisation: 0, cibles: 0, count: 0 };
            anneeMap[yr].realisation += Number(v.taux_realisation ?? 0);
            anneeMap[yr].cibles += Number(v.taux_cible ?? 0);
            anneeMap[yr].count += 1;
        });
        return Object.entries(anneeMap)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([annee, d]) => ({
                annee,
                realisation: d.count > 0 ? Math.round(d.realisation / d.count) : 0,
                cibles: d.count > 0 ? Math.round(d.cibles / d.count) : 0,
            }));
    }, [versions]);

    // ── Avancement par service ────────────────────────────────────────────────────
    const buildServiceData = (annee: number | null): ServiceData[] => {
        const acts = filtrerActivitesParAnnee(annee);
        const tchFiltrees = filtrerTaches(acts);
        const serviceMap: Record<string, { total: number; terminees: number }> = {};
        tchFiltrees.forEach((t) => {
            const sid = t.n_lot_gt?.toString() ?? "Non assigné";
            if (!serviceMap[sid]) serviceMap[sid] = { total: 0, terminees: 0 };
            serviceMap[sid].total += 1;
            if (
                t.valider_gt?.toLowerCase() === "validé" ||
                t.valider_gt?.toLowerCase() === "valide"
            )
                serviceMap[sid].terminees += 1;
        });
        return Object.entries(serviceMap)
            .map(([sid, d]) => {
                const ps = plansSites.find((p) => p.id_ds === Number(sid));
                return {
                    service: ps?.intutile_ds ?? `Service ${sid}`,
                    tachesTerminees: d.terminees,
                    tachesTotal: d.total,
                    pourcentage: d.total > 0 ? Math.round((d.terminees / d.total) * 100) : 0,
                };
            })
            .sort((a, b) => b.pourcentage - a.pourcentage);
    };

    const avancementTaches = useMemo(() => buildServiceData(anneeTaches).slice(0, 10), [
        taches, activites, versions, plansSites, anneeTaches,
    ]);
    const avancementIndicateurs = useMemo(() => buildServiceData(anneeIndicateurs).slice(0, 8), [
        taches, activites, versions, plansSites, anneeIndicateurs,
    ]);

    // ── Décaissements ─────────────────────────────────────────────────────────────
    const decaissFiltres = useMemo(
        () =>
            decaissements.filter(
                (d: any) => d.id_ptba?.id_programme === idProgramme
            ),
        [decaissements, idProgramme]
    );

    const decaissementBailleur = useMemo(() => {
        const map: Record<string, { prevu: number; decaisse: number }> = {};
        decaissFiltres.forEach((d: any) => {
            const b = d.bailleur ?? d.id_ptba?.bailleur ?? "Autre";
            if (!map[b]) map[b] = { prevu: 0, decaisse: 0 };
            map[b].decaisse += Number(d.valeur_decaissement_ptba ?? 0);
            map[b].prevu += Number(d.montant_prevu_ptba ?? d.valeur_decaissement_ptba ?? 0);
        });
        return Object.entries(map).map(([bailleur, d]) => ({
            bailleur,
            montant_prevu: d.prevu,
            montant_decaisse: d.decaisse,
            taux: d.prevu > 0 ? Math.round((d.decaisse / d.prevu) * 100) : 0,
        }));
    }, [decaissFiltres]);

    const decaissementMensuel = useMemo(() => {
        const map: Record<string, number> = {};
        decaissFiltres.forEach((d: any) => {
            const mois = new Date(d.date_decaissement_ptba).toLocaleString("fr-FR", {
                month: "short",
                year: "2-digit",
            });
            map[mois] = (map[mois] || 0) + Number(d.valeur_decaissement_ptba ?? 0);
        });
        return Object.entries(map).map(([mois, montant]) => ({ mois, montant }));
    }, [decaissFiltres]);

    // ── Notifications simulées ─────────────────────────────────────────────────
    const notifications = useMemo(
        () => [
            {
                id: 1,
                message: `${stats.enRetard} tâche${stats.enRetard > 1 ? "s" : ""} en retard nécessitent votre attention`,
                type: "warning" as const,
                time: "Maintenant",
                lu: false,
            },
            {
                id: 2,
                message: "Rapport mensuel disponible pour téléchargement",
                type: "info" as const,
                time: "Il y a 2h",
                lu: false,
            },
            {
                id: 3,
                message: "Sprint Q2 terminé avec succès",
                type: "success" as const,
                time: "Hier",
                lu: true,
            },
        ],
        [stats.enRetard]
    );

    // ── Loader désactivé pour les données fictives ─────────────────────────────
    // if (isLoading) {
    //     return (
    //         <div className="flex items-center justify-center min-h-screen">
    //             Chargement des donnees du dashboard
    //         </div>
    //     );
    // }

    // ── Render ────────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
            {/* En-tête */}
            <DashboardHeader
                nomProgramme={`Programme ${codeProgramme || "Demo"}`}
                notifications={notifications}
                onSearchProject={setSearchQuery}
            />

            {/* ── Cartes statistiques ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    title="Total des projets"
                    value={stats.totalProjets}
                    subtitle="Projets enregistrés"
                    icon={ClipboardListIcon}
                    color="blue"
                />
                <StatCard
                    title="Tâches validées"
                    value={stats.validees}
                    subtitle={`${stats.taux}% de réalisation`}
                    icon={CheckCircle2Icon}
                    color="green"
                    trend={{ value: `${stats.taux}%`, positive: Number(stats.taux) >= 50 }}
                />
                <StatCard
                    title="Tâches en cours"
                    value={stats.enCours}
                    subtitle="En progression"
                    icon={TrendingUpIcon}
                    color="purple"
                />
                <StatCard
                    title="Tâches en retard"
                    value={stats.enRetard}
                    subtitle="Nécessitent attention"
                    icon={AlertCircleIcon}
                    color="orange"
                    trend={
                        stats.enRetard > 0
                            ? { value: `${stats.enRetard}`, positive: false }
                            : undefined
                    }
                />
            </div>

            {/* ── Tableau des projets ── */}
            <ProjectTable
                projets={projetRowsFiltered}
                pageSize={10}
                onProjetClick={(p) => {
                    console.log("Naviguer vers projet", p.id);
                }}
            />

            {/* ── Graphiques ligne 1 : PTBA par composante + Réalisation/Cibles ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PTBAComposanteChart
                    data={composanteData}
                    anneesDisponibles={anneesDisponibles}
                    selectedAnnee={anneeComposante}
                    onAnneeChange={setAnneeComposante}
                />
                <RealisationCiblesChart
                    data={realisationCiblesData}
                    title="Réalisation vs Cibles cumulées"
                    subtitle="Évolution annuelle — Réalisation (vert) · Cibles (jaune)"
                />
            </div>

            {/* ── Graphiques ligne 2 : Avancement par service ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AvancementServiceChart
                    data={avancementTaches}
                    mode="pourcentage"
                    anneesDisponibles={anneesDisponibles}
                    selectedAnnee={anneeTaches}
                    onAnneeChange={setAnneeTaches}
                    title="Avancement des tâches par service (Top 10)"
                    subtitle="Taux de réalisation par direction"
                />
                <AvancementServiceChart
                    data={avancementTaches.slice(0, 6)}
                    mode="detail"
                    anneesDisponibles={anneesDisponibles}
                    selectedAnnee={anneeTaches}
                    onAnneeChange={setAnneeTaches}
                    title="Détail des tâches par service"
                    subtitle="Terminées vs Total (Top 6)"
                />
            </div>

            {/* ── Graphique indicateurs ── */}
            <AvancementServiceChart
                data={avancementIndicateurs}
                mode="pourcentage"
                anneesDisponibles={anneesDisponibles}
                selectedAnnee={anneeIndicateurs}
                onAnneeChange={setAnneIndicateurs}
                title="Avancement des indicateurs par service"
                subtitle="Taux de réalisation des indicateurs par direction"
            />

            {/* ── Graphiques décaissements ── */}
            <DecaissementCharts
                dataBailleur={decaissementBailleur}
                dataMensuel={decaissementMensuel}
            />

            {/* ── Tableau récapitulatif ── */}
            <RecapitulatifTable data={avancementTaches} />
        </div>
    );
};

export default DashboardPage;