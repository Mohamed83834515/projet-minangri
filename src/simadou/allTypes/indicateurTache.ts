// Types spécifiques pour les indicateurs de tâches PTBA

export interface IndicateurTache extends Record<string, unknown> {
  id_indicateur_tache: number;
  intitule_indicateur_tache: string;
  unite_ind_tache: string;
  code_indicateur_ptba: string;
  indicateur_cmr: number; // relation vers IndicateurCmr
  id_activite: number; // relation vers Ptba
  trimestre1: string;
  trimestre2: string;
  trimestre3: string;
  trimestre4: string;
  created_at?: string;
  updated_at?: string;
}

export interface IndicateurTacheRequest {
  intitule_indicateur_tache: string;
  unite_ind_tache: string;
  trimestre1: string;
  trimestre2: string;
  trimestre3: string;
  trimestre4: string;
}
