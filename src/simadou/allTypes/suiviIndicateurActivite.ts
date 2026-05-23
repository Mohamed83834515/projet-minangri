import { IndicateurActivitePtba } from "./indicateurActivitePtba";
import { Localite } from "./localite";

export interface SuiviIndicateurActivite extends Record<string, unknown> {
  id_suivi_indicateur: number;
  date_suivi_indicateur: string;
  valeur_suivi_indicateur: number; // double
  indicateur_activite?: string | IndicateurActivitePtba | null; // relation via code_indicateur_activite
  localite?: string | Localite | null; // relation via code_loca
}
