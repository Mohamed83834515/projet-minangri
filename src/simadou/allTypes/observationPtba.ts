import { Ptba } from "./ptba";

export interface ObservationPtba extends Record<string, unknown> {
  id_observation: number;
  observation: string;
  date_observation: string;
  ptba?: string | Ptba | null; // relation via code_activite_ptba
}
