import { ActiviteProjet } from "./activiteProjet";
import { Projet } from "./projet";
import { UniteIndicateur } from "./uniteIndicateur";

export interface IndicateurPerformanceProjet extends Record<string, unknown> {
  id_indicateur_performance: number;
  code_indicateur_performance: string;
  intitule_indicateur_tache: string;
  code_activite_projet?: string | number | ActiviteProjet | null;
  unite_indicateur_performance?: number | UniteIndicateur | null;
  code_projet?: string | Projet | null;
}
