import { z } from 'zod'
import { ConfigurationSchema} from '@/simadou/schemas/configurations.schema'

export const integrationsSchema = ConfigurationSchema.pick({
  parent_api_url:             true,
  parent_api_key:             true,
  parent_api_timeout_seconds: true,
})

export type IntegrationsInput = z.infer<typeof integrationsSchema>