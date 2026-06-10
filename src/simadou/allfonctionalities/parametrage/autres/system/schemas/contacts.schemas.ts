import { ConfigurationSchema } from '@/simadou/schemas/configurations.schema'
import { z } from 'zod'


export const contactsSchema = ConfigurationSchema.pick({
  structure_email:          true,
  structure_phone_number:   true,
  structure_whatsapp_number: true,
})

export type ContactsInput = z.infer<typeof contactsSchema>