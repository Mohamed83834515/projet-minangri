import { z } from 'zod'
import { ConfigurationSchema} from '@/simadou/schemas/configurations.schema'

export const securiteSchema = ConfigurationSchema.pick({
  is_maintenance:       true,
  inactivity_minute:    true,
  max_sessions:         true,
  max_login_attempts:   true,
  otp_validity_minute:  true,
  password_expiry_month: true,
  delay_update_second:  true,
})

export type SecuriteInput = z.infer<typeof securiteSchema>