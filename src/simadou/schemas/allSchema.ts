import { roles } from '@/simadou/allfonctionalities/users/data'
import z from 'zod'

// user

export const usersSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Facet filters
  status: z
    .array(
      z.union([
        z.literal('active'),
        z.literal('inactive'),
        z.literal('invited'),
        z.literal('suspended'),
      ])
    )
    .optional()
    .catch([]),
  role: z
    .array(z.enum(roles.map((r) => r.value as (typeof roles)[number]['value'])))
    .optional()
    .catch([]),
  username: z.string().optional().catch(''),
})
//
const userStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('suspended'),
])
export type UserStatus = z.infer<typeof userStatusSchema>

const userRoleSchema = z.union([
  z.literal('superadmin'),
  z.literal('admin'),
  z.literal('cashier'),
  z.literal('manager'),
])

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
  email: z.string(),
  status: userStatusSchema,
  role: userRoleSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type User = z.infer<typeof userSchema>;



// Staff 
// ── Recherche & filtres ───────────────────────────────────────────────────────

export const staffSearchSchema = z.object({
  page:     z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),

  // Filtres à facettes
  status: z
    .array(
      z.union([
        z.literal('active'),
        z.literal('inactive'),
        z.literal('invited'),
        z.literal('suspended'),
      ])
    )
    .optional()
    .catch([]),

  role: z
    .array(z.enum(roles.map((r) => r.value as (typeof roles)[number]['value'])))
    .optional()
    .catch([]),

  username: z.string().optional().catch(''),
})

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
  id:        z.string(),
  nom:       z.string(),
  prenom:    z.string(),
  email:     z.string(),
  adresse:   z.string(),
  phone:     z.string(),
  status:    staffStatusSchema,
  role:      staffRoleSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Staff = z.infer<typeof _staffSchema>