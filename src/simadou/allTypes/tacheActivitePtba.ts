import { Personnel } from "./personnel";

export interface TacheActivitePtba extends Record<string, unknown> {
  id_groupe_tache: number;
  intutile_tache_gt: string; // max 200 chars
  proportion_gt: string; // max 10 chars
  code_tache_gt: string; // max 200 chars
  date_debut_gt: string; // date
  date_fin_gt: string; // date
  date_reelle_gt: string; // date
  n_lot_gt: number;
  valider_gt: string; // max 100 chars
  observation_gt?: string; // max 200 chars
  livrable_gt: string; // max 100 chars
  id_personnel_gt: number | Personnel;
  responsable_gt?: number | Personnel; // max 100 chars
  id_activite: number; // relation vers Ptba
  created_at?: string;
  updated_at?: string;
}
