// import { FieldType } from "@/Global/types/formConfig"
// import { z } from "zod"

// export const GeneralParamsSchema = z.object({
//   id: z.string(),

//   // App branding
//   appName: z.string(),
//   logoUrl: z.string().nullable().optional(),
//   logoPublicId: z.string().nullable().optional(),
//   primaryColor: z.string().nullable().optional(),

//   // Contacts structure
//   contactEmail: z.string().email().nullable().optional(),
//   contactPhone: z.string().nullable().optional(),
//   address: z.string().nullable().optional(),
//   website: z.string().url().nullable().optional(),

//   // Structure CEP / système
//   systemSigle: z.string().nullable().optional(),
//   systemTitle: z.string().nullable().optional(),

//   structureSigle: z.string().nullable().optional(),
//   structureName: z.string().nullable().optional(),
//   structureLogo: z.string().nullable().optional(),
//   structureAddress: z.string().nullable().optional(),
//   structureEmail: z.string().email().nullable().optional(),
//   structurePhone: z.string().nullable().optional(),
//   structureWhatsapp: z.string().nullable().optional(),

//   // Finance
//   currencyCode: z.string().nullable().optional(),
//   baseCurrency: z.string().nullable().optional(),
//   exchangeRate: z.number().nullable().optional(),

//   // Sécurité / système
//   maintenanceMode: z.boolean().optional(),
//   inactivityDelayMinutes: z.number().int().positive().optional(),
//   maxSessions: z.number().int().positive().optional(),
//   loginAttemptsLimit: z.number().int().positive().optional(),
//   tpCodeDelayMinutes: z.number().int().positive().optional(),
//   passwordChangeDelayMonths: z.number().int().positive().optional(),
//   deleteOrUpdateDelaySeconds: z.number().int().positive().optional(),

//   // WhatsApp / email / SMTP
//   whatsappInstanceCode: z.string().nullable().optional(),
//   notificationEmail: z.string().email().nullable().optional(),
//   notificationEmailPassword: z.string().nullable().optional(),
//   smtpHost: z.string().nullable().optional(),
//   parentApiUrl: z.string().url().nullable().optional(),

//   createdAt: z.string(),
//   updatedAt: z.string(),
// })

// export type GeneralParamsInput = z.infer<typeof GeneralParamsSchema>




// // Returns the right zod schema based on field type
// export function getFieldSchema(type: FieldType, required?: boolean) {
//   const base = (() => {
//     switch (type) {
//       case 'email':
//         return z.string().email('Email invalide')
//       case 'url':
//         return z.string().url('URL invalide')
//       case 'tel':
//         return z.string().min(8, 'Numéro invalide').max(20, 'Numéro invalide')
//       case 'number':
//         return z.coerce.number({error : (iss)=> iss.input === undefined ? "Entrez un nombre valide" : "Entrée invalide"}).min(0)
    
//       default:
//         return z.string().min(1, 'Ce champ est requis')
//     }
//   })()

//   // Most params fields are optional
//   return required ? base : base.optional().or(z.literal(''))
// }


import { z } from 'zod'

export const ConfigurationSchema = z.object({
  id:                         z.number().int(),
  system_sigle:               z.string().nullable().optional(),
  system_name:                z.string().nullable().optional(),
  structure_sigle:            z.string().nullable().optional(),
  structure_name:             z.string().nullable().optional(),
  structure_logo:             z.string().nullable().optional(),
  structure_address:          z.string().nullable().optional(),
  structure_email:            z.string().email().nullable().optional(),
  structure_whatsapp_number:  z.string().nullable().optional(),
  structure_phone_number:     z.string().nullable().optional(),
  local_currency_sigle:       z.string().nullable().optional(),
  main_currency_sigle:        z.string().nullable().optional(),
  main_currency_rate:         z.string().nullable().optional(),
  is_maintenance:             z.boolean().optional(),
  inactivity_minute:          z.number().int().min(0).optional(),
  max_sessions:               z.number().int().min(0).optional(),
  max_login_attempts:         z.number().int().min(0).optional(),
  otp_validity_minute:        z.number().int().min(0).optional(),
  password_expiry_month:      z.number().int().min(0).optional(),
  delay_update_second:        z.number().int().min(0).optional(),
  whatsapp_instance:          z.string().nullable().optional(),
  whatsapp_number_id:         z.string().nullable().optional(),
  notif_email:                z.string().email().nullable().optional(),
  notif_email_smtp_host:      z.string().nullable().optional(),
  notif_email_smtp_port:      z.number().int().optional(),
  notif_email_smtp_encryption: z.string().nullable().optional(),
  notif_email_from_name:      z.string().nullable().optional(),
  parent_api_url:             z.string().url().nullable().optional(),
  parent_api_key:             z.string().nullable().optional(),
  parent_api_timeout_seconds: z.number().int().optional(),
  is_default:                 z.boolean().optional(),
  created_at:                 z.string(),
  updated_at:                 z.string(),
})

// Patch — every field optional except id
export const PatchConfigurationSchema = ConfigurationSchema
  .omit({ id: true, created_at: true, updated_at: true, is_default: true })
  .partial()

// Single field patch — what actually gets sent per inline edit
export const InlineFieldPatchSchema = z.object({
  field: z.string(),
  value: z.union([z.string(), z.number(), z.boolean(), z.null()]),
})

// Creation — only the minimum fields
export const CreateConfigurationSchema = z.object({
  structure_name:  z.string().min(1, 'Requis'),
  structure_sigle: z.string().min(1, 'Requis'),
})

export type Configuration        = z.infer<typeof ConfigurationSchema>
export type PatchConfiguration   = z.infer<typeof PatchConfigurationSchema>
export type CreateConfiguration  = z.infer<typeof CreateConfigurationSchema>
export type InlineFieldPatch     = z.infer<typeof InlineFieldPatchSchema>

// Field value type — used in InlineField
export type ConfigFieldKey = keyof PatchConfiguration
export type ConfigFieldValue = string | number | boolean | null