import { IndicateurPerformanceProjet } from "./indicateurPerformanceProjet";
import { Ptba } from "./ptba";
import { UniteIndicateur } from "./uniteIndicateur";

export interface IndicateurActivitePtba extends Record<string, unknown> {
  id_indicateur_activite: number;
  code_indicateur_activite: string;
  intitule_indicateur_tache: string;
  activite_ptba?: string | Ptba | null;
  code_indicateur_performance?: string | IndicateurPerformanceProjet | null;
  abrege_unite?: number | UniteIndicateur | null;
}
