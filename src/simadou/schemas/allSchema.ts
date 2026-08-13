import z from "zod"


// ── Statut ────────────────────────────────────────────────────────────────────

const staffStatusSchema = z.union([
  z.literal('active'),    // Actif
  z.literal('inactive'),  // Inactif
  z.literal('invited'),   // Invitation envoyée, compte non confirmé
  z.literal('suspended'), // Suspendu temporairement
])

export type StaffStatus = z.infer<typeof staffStatusSchema>

// ── Rôle ──────────────────────────────────────────────────────────────────────

const staffRoleSchema = z.union([
  z.literal('superadmin'), // Accès total, gestion des admins
  z.literal('admin'),      // Gestion des utilisateurs et paramètres
  z.literal('manager'),    // Gestion opérationnelle
  z.literal('cashier'),    // Accès caisse uniquement
])

// ── Schéma principal ─────────────────────────────────────────────────────────

export const _staffSchema = z.object({
  id: z.string(),
  nom: z.string(),
  prenom: z.string(),
  email: z.string(),
  adresse: z.string(),
  phone: z.string(),
  status: staffStatusSchema,
  role: staffRoleSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Staff = z.infer<typeof _staffSchema>