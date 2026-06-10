import { z } from 'zod'
import { ConfigurationSchema } from '@/simadou/schemas/configurations.schema'

export const notificationsSchema = ConfigurationSchema.pick({
  whatsapp_instance:          true,
  whatsapp_number_id:         true,
  notif_email:                true,
  notif_email_smtp_host:      true,
  notif_email_smtp_port:      true,
  notif_email_smtp_encryption: true,
  notif_email_from_name:      true,
})

export type NotificationsInput = z.infer<typeof notificationsSchema>