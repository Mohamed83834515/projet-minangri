import { ActiviteProjet } from "./activiteProjet";
import { Projet } from "./projet";
import { UniteIndicateur } from "./uniteIndicateur";

export interface IndicateurPerformanceProjet extends Record<string, unknown> {
  id_indicateur_performance: number;
  type_ind: number;
  code_indicateur_performance: string;
  intitule_indicateur_tache: string;
  activite_projet: string | ActiviteProjet;
  unite_indicateur_performance: number | UniteIndicateur | null;
  code_projet?: string | Projet | null;
  cibles?: CiblesIndicateurPerformanceProjet | null
}
export interface CiblesIndicateurPerformanceProjet extends Record<string, unknown> {
  annee: number;
  valeur_cible: string;
  intitule_indicateur_tache: string;
  indicateur_ppa: string;
}
