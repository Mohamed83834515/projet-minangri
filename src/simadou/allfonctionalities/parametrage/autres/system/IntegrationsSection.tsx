import { InlineField } from "./components/InlineFields"
import type { Configuration } from "@/simadou/schemas/configurations.schema"

export function IntegrationsSection({ config }: { config: Configuration }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <InlineField
        configId={config.id}
        field="parent_api_url"
        value={config.parent_api_url ?? ''}
        label="URL de l'API parente"
        type="url"
        placeholder="https://api.parent-system.net"
        helperText="Lien vers le système parent"
      />
      <InlineField
        configId={config.id}
        field="parent_api_key"
        value={config.parent_api_key ?? ''}
        label="Clé API parente"
        type="password"
        placeholder="••••••••"
      />
      <InlineField
        configId={config.id}
        field="parent_api_timeout_seconds"
        value={config.parent_api_timeout_seconds ?? 30}
        label="Timeout API (sec)"
        type="number"
        min={0}
        helperText="Délai max avant abandon de la requête"
      />
    </div>
  )
}