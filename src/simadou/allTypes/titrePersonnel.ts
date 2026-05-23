export interface TitrePersonnel extends Record<string, unknown> {
  id_titre: number;
  libelle_titre: string;
  description_titre?: string;
}
