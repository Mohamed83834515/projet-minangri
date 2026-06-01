import { FieldType } from "@/Global/types/formConfig"
import { z } from "zod"

export const GeneralParamsSchema = z.object({
  id: z.string(),

  // App branding
  appName: z.string(),
  logoUrl: z.string().nullable().optional(),
  logoPublicId: z.string().nullable().optional(),
  primaryColor: z.string().nullable().optional(),

  // Contacts structure
  contactEmail: z.string().email().nullable().optional(),
  contactPhone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  website: z.string().url().nullable().optional(),

  // Structure CEP / système
  systemSigle: z.string().nullable().optional(),
  systemTitle: z.string().nullable().optional(),

  structureSigle: z.string().nullable().optional(),
  structureName: z.string().nullable().optional(),
  structureLogo: z.string().nullable().optional(),
  structureAddress: z.string().nullable().optional(),
  structureEmail: z.string().email().nullable().optional(),
  structurePhone: z.string().nullable().optional(),
  structureWhatsapp: z.string().nullable().optional(),

  // Finance
  currencyCode: z.string().nullable().optional(),
  baseCurrency: z.string().nullable().optional(),
  exchangeRate: z.number().nullable().optional(),

  // Sécurité / système
  maintenanceMode: z.boolean().optional(),
  inactivityDelayMinutes: z.number().int().positive().optional(),
  maxSessions: z.number().int().positive().optional(),
  loginAttemptsLimit: z.number().int().positive().optional(),
  tpCodeDelayMinutes: z.number().int().positive().optional(),
  passwordChangeDelayMonths: z.number().int().positive().optional(),
  deleteOrUpdateDelaySeconds: z.number().int().positive().optional(),

  // WhatsApp / email / SMTP
  whatsappInstanceCode: z.string().nullable().optional(),
  notificationEmail: z.string().email().nullable().optional(),
  notificationEmailPassword: z.string().nullable().optional(),
  smtpHost: z.string().nullable().optional(),
  parentApiUrl: z.string().url().nullable().optional(),

  createdAt: z.string(),
  updatedAt: z.string(),
})

export type GeneralParamsInput = z.infer<typeof GeneralParamsSchema>






// Returns the right zod schema based on field type
export function getFieldSchema(type: FieldType, required?: boolean) {
  const base = (() => {
    switch (type) {
      case 'email':
        return z.string().email('Email invalide')
      case 'url':
        return z.string().url('URL invalide')
      case 'tel':
        return z.string().min(8, 'Numéro invalide').max(20, 'Numéro invalide')
      case 'number':
        return z.coerce.number({error : (iss)=> iss.input === undefined ? "Entrez un nombre valide" : "Entrée invalide"}).min(0)
    
      default:
        return z.string().min(1, 'Ce champ est requis')
    }
  })()

  // Most params fields are optional
  return required ? base : base.optional().or(z.literal(''))
}