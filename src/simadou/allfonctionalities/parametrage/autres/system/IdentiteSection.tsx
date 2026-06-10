import { InlineField } from "./components/InlineFields"
import type { Configuration } from "@/simadou/schemas/configurations.schema"

interface Props {
  config: Configuration
}

export function IdentiteSection({ config }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <InlineField
        configId={config.id}
        field="system_sigle"
        value={config.system_sigle ?? ''}
        label="Sigle du système"
        placeholder="SEGAR"
      />
      <InlineField
        configId={config.id}
        field="system_name"
        value={config.system_name ?? ''}
        label="Intitulé du système"
        placeholder="Suivi Evaluation Global Axé sur les Résultats"
      />
      <InlineField
        configId={config.id}
        field="structure_sigle"
        value={config.structure_sigle ?? ''}
        label="Sigle de la structure"
        placeholder="CEP"
      />
      <InlineField
        configId={config.id}
        field="structure_name"
        value={config.structure_name ?? ''}
        label="Nom de la structure"
        placeholder="Cellule Exécution des Projets"
      />
      <InlineField
        configId={config.id}
        field="structure_address"
        value={config.structure_address ?? ''}
        label="Adresse de la structure"
        placeholder="Kaloum Conakry"
      />
      <InlineField
        configId={config.id}
        field="structure_logo"
        value={config.structure_logo ?? ''}
        label="Logo (URL)"
        type="url"
        placeholder="https://..."
      />
    </div>
  )
}