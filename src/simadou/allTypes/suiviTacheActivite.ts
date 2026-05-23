import type { TacheActivitePtba } from "./tacheActivitePtba";

/** Suivi de tâche d'activité */
export interface SuiviTacheActivite {
  id_suivi_groupe_tache: number;
  proportion_realisee: number;
  valide: boolean;
  /** Date réelle (nom champ API) */
  date_reele: string;
  observation_suivi: string;
  livrable_suivi: string;
  /** L’API renvoie souvent la tâche imbriquée au lieu de l’id seul */
  id_groupe_tache: number | TacheActivitePtba;
  id_activite_ptba: number;
}

export function resolveIdGroupeTache(
  ref: number | TacheActivitePtba | undefined | null,
): number | undefined {
  if (ref == null) return undefined;
  if (typeof ref === "object") return ref.id_groupe_tache;
  return ref;
}

/** Ids de tâches déjà couvertes par un suivi (hors suivi en cours d’édition). */
export function getUsedGroupeTacheIds(
  suivis: SuiviTacheActivite[],
  excludeSuiviId?: number,
): Set<number> {
  const ids = new Set<number>();
  for (const s of suivis) {
    if (
      excludeSuiviId != null &&
      s.id_suivi_groupe_tache === excludeSuiviId
    ) {
      continue;
    }
    const id = resolveIdGroupeTache(s.id_groupe_tache);
    if (id != null) ids.add(id);
  }
  return ids;
}

export function findSuiviForTache(
  suivis: SuiviTacheActivite[],
  idGroupeTache: number,
): SuiviTacheActivite | undefined {
  return suivis.find(
    (s) => resolveIdGroupeTache(s.id_groupe_tache) === idGroupeTache,
  );
}

/** Taux d'avancement global : moyenne des proportions réalisées par tâche. */
export function tauxAvancementGlobalTaches(
  taches: TacheActivitePtba[],
  suivis: SuiviTacheActivite[],
): number {
  if (taches.length === 0) return 0;

  const percents = taches.map((tache) => {
    const suivi = findSuiviForTache(suivis, tache.id_groupe_tache);
    return suivi?.proportion_realisee ?? 0;
  });

  return Math.round(
    percents.reduce((sum, p) => sum + p, 0) / taches.length,
  );
}

export function intituleGroupeTache(
  ref: number | TacheActivitePtba,
  taches: TacheActivitePtba[],
): string {
  if (typeof ref === "object") {
    return (
      ref.intutile_tache_gt?.trim() ||
      ref.code_tache_gt ||
      `— (${ref.id_groupe_tache})`
    );
  }
  const t = taches.find((x) => x.id_groupe_tache === ref);
  return (
    t?.intutile_tache_gt?.trim() || t?.code_tache_gt || `— (${ref})`
  );
}
