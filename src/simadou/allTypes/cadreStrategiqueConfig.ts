import { Programme } from "./programme";

export interface CadreStrategiqueConfig extends Record<string, unknown> {
  id_nsc: number;
  nombre: number;
  libelle_nsc: string;
  type_nsc: 1 | 2 | 3; // 1 - Effet, 2 - Produit, 3 - Impact
  date_enregistrement: string;
  date_modification: string;
  etat?: number;
  programme?: Programme | null;
  created_at?: string;
  updated_at?: string;
}

export type CadreStrategiqueConfigFormData = Omit<
  CadreStrategiqueConfig,
  "id_nsc"
>;
