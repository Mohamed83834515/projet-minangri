export interface IndicateurCadreResultat extends Record<string, unknown> {
  id_indicateur_cr_iop: number;
  niveau_iop: number;
  code_indicateur_cr_iop: string;
  code_cr_iop: string;
  intitule_indicateur_cr_iop: string;
  periodicite_iop: string;
  source_iop: string;
  responsable_iop: string;
  description_iop: string;
  structure_iop?: string;
  projet_iop?: string;
  created_at?: string;
  updated_at?: string;
}

export type IndicateurCadreResultatFormData = Omit<
  IndicateurCadreResultat,
  "id_indicateur_cr_iop"
>;
