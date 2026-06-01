import { z } from "zod";

// Schéma de validation pour IndicateurTache
export const indicateurTacheSchema = z.object({
  intitule_indicateur_tache: z
    .string()
    .min(1, "L'intitulé de l'indicateur est requis")
    .max(200, "L'intitulé ne peut pas dépasser 200 caractères"),

  trimestre1: z
    .string()
    .min(1, "Le trimestre 1 est requis")
    .max(100, "Le trimestre 1 ne peut pas dépasser 100 caractères"),

  trimestre2: z
    .string()
    .min(1, "Le trimestre 2 est requis")
    .max(100, "Le trimestre 2 ne peut pas dépasser 100 caractères"),

  trimestre3: z
    .string()
    .min(1, "Le trimestre 3 est requis")
    .max(100, "Le trimestre 3 ne peut pas dépasser 100 caractères"),

  trimestre4: z
    .string()
    .min(1, "Le trimestre 4 est requis")
    .max(100, "Le trimestre 4 ne peut pas dépasser 100 caractères"),

  unite_ind_tache: z
    .string()
    .min(1, "L'unité de mesure est requise")
    .max(50, "L'unité ne peut pas dépasser 50 caractères"),

  code_indicateur_ptba: z
    .string()
    .min(1, "Le code de l'indicateur est requis")
    .max(50, "Le code ne peut pas dépasser 50 caractères"),

  indicateur_cmr: z
    .number()
    .int("L'ID de l'indicateur CMR doit être un entier")
    .min(0, "L'ID de l'indicateur CMR doit être positif ou zéro"),

  id_activite: z
    .number()
    .int("L'ID de l'activité doit être un entier")
    .positive("L'ID de l'activité doit être positif"),
});

// Type inféré du schéma
export type IndicateurTacheFormData = z.infer<typeof indicateurTacheSchema>;
