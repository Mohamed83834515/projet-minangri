import { InlineField } from "./components/InlineFields"
import type { Configuration } from "@/simadou/schemas/configurations.schema"

export function FinanceSection({ config }: { config: Configuration }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <InlineField
        configId={config.id}
        field="local_currency_sigle"
        value={config.local_currency_sigle ?? ''}
        label="Monnaie locale"
        placeholder="GNF"
        helperText="Sigle de la monnaie du pays"
      />
      <InlineField
        configId={config.id}
        field="main_currency_sigle"
        value={config.main_currency_sigle ?? ''}
        label="Devise principale"
        placeholder="USD"
        helperText="Sigle de la devise de référence"
      />
      <InlineField
        configId={config.id}
        field="main_currency_rate"
        value={config.main_currency_rate ?? ''}
        label="Taux de change"
        type="number"
        placeholder="9000"
        helperText="1 USD = X GNF"
      />
    </div>
  )
}