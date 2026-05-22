import { z } from "zod";

export const suiviTacheActiviteSchema = z.object({
  id_groupe_tache: z.number().int().positive("Sélectionnez une tâche"),
  date_reele: z
    .string()
    .min(1, "La date est requise")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format YYYY-MM-DD"),
  observation_suivi: z.string().max(2000),
  /** Texte existant (édition) ou vide ; le fichier va dans livrable_fichier */
  livrable_suivi: z.string().max(500),
  livrable_fichier: z.array(z.instanceof(File)).default([]),
  proportion_realisee: z
    .number()
    .min(0, "Min. 0")
    .max(100, "Max. 100"),
  valide: z.boolean(),
});

export type SuiviTacheActiviteFormData = z.output<
  typeof suiviTacheActiviteSchema
>;
