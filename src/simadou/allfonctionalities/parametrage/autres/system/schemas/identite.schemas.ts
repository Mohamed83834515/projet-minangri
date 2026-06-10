import { ConfigurationSchema } from '@/simadou/schemas/configurations.schema'
import { z } from 'zod'


export const identiteSchema = ConfigurationSchema.pick({
  system_sigle:      true,
  system_name:       true,
  structure_sigle:   true,
  structure_name:    true,
  structure_logo:    true,
  structure_address: true,
})


export type IdentiteInput = z.infer<typeof identiteSchema>