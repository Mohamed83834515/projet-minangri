import { z } from "zod";

export const STATUT_ACTIVITE_VALUES = [
  "en cours",
  "en attente",
  "réalisé",
] as const;

export const ETAT_SUIVI_VALUES = ["ajout", "modification"] as const;

export const statutActiviteOptions = [
  { value: "en cours", label: "En cours" },
  { value: "en attente", label: "En attente" },
  { value: "réalisé", label: "Réalisé" },
] as const;

export const etatSuiviOptions = [
  { value: "ajout", label: "Ajout" },
  { value: "modification", label: "Modification" },
] as const;

export const suiviAvancementContratSchema = z.object({
  date_suivi: z
    .string()
    .min(1, "La date est requise")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format YYYY-MM-DD"),
  statut_activite: z.enum(STATUT_ACTIVITE_VALUES, {
    message: "Sélectionnez un statut d'activité",
  }),
  etat_avancement: z.string().max(2000),
  retard_accuse: z.string().max(500),
  difficultes_rencontrees: z.string().max(2000),
  pistes_solutions: z.string().max(2000),
  observation: z.string().max(2000),
  etat: z.enum(ETAT_SUIVI_VALUES, {
    message: "Sélectionnez un état",
  }),
  documents_fichiers: z.array(z.instanceof(File)).default([]),
});

export type SuiviAvancementContratFormData = z.output<
  typeof suiviAvancementContratSchema
>;
