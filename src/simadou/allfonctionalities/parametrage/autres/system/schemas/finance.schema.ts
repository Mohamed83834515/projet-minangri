import { ConfigurationSchema } from '@/simadou/schemas/configurations.schema'
import { z } from 'zod'


export const financeSchema = ConfigurationSchema.pick({
  local_currency_sigle: true,
  main_currency_sigle:  true,
  main_currency_rate:   true,
})

export type FinanceInput = z.infer<typeof financeSchema>