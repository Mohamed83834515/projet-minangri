/** Pièce jointe liée à un suivi d'avancement contrat */
export interface SourceVerificationSuiviAvancementContrat
  extends Record<string, unknown> {
  id_source_verif: number;
  fichier_join: string;
  suivi_avancement_contrat: number;
}
