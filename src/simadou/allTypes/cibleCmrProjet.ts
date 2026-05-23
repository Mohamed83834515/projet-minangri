import { IndicateurCadreResultat } from "./indicateurCadreResultat";
import { UGL } from "./ugl";

export interface CibleCmrProjet extends Record<string, unknown> {
  id_cible_indicateur_crp: number; // readOnly
  annee: string; // date format - Année de la cible
  valeur_cible_indcateur_crp: number; // Valeur cible de l'indicateur CRP
  code_indicateur_crp?: string | null; // Code de l'indicateur de résultat du projet, relation avec IndicateurCadreResultat via code_indicateur_cr_iop
  code_ug?: string | null; // Code UGL, relation avec UGL via code_ugl
  code_projet?: string | null; // Code du projet concerné
  // Relations populées
  indicateur_crp?: IndicateurCadreResultat | null; // Relation vers IndicateurCadreResultat
  ugl?: UGL | null; // Relation vers UGL
}
