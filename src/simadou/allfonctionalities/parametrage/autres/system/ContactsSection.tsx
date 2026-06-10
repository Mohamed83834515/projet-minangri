import { InlineField } from "./components/InlineFields"
import type { Configuration } from "@/simadou/schemas/configurations.schema"

export function ContactsSection({ config }: { config: Configuration }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <InlineField
        configId={config.id}
        field="structure_email"
        value={config.structure_email ?? ''}
        label="Email de la structure"
        type="email"
        placeholder="contact@cep.gn"
      />
      <InlineField
        configId={config.id}
        field="structure_phone_number"
        value={config.structure_phone_number ?? ''}
        label="Téléphone"
        type="tel"
        placeholder="+224 622 000 000"
      />
      <InlineField
        configId={config.id}
        field="structure_whatsapp_number"
        value={config.structure_whatsapp_number ?? ''}
        label="WhatsApp"
        type="tel"
        placeholder="+224 622 000 000"
      />
    </div>
  )
}