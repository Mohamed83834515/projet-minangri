export interface NiveauActiviteProjet extends Record<string, unknown> {
  id_niveau_activite_projet: number;
  nombre_niveau_activite_projet: number;
  libelle_niveau_activite_projet: string;
  taille_code_niveau_activite_projet: number;
  code_projet?: string | null;
}
