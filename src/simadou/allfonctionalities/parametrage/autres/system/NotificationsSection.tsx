import { InlineField } from "./components/InlineFields"
import type { Configuration } from "@/simadou/schemas/configurations.schema"

export function NotificationsSection({ config }: { config: Configuration }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <InlineField
        configId={config.id}
        field="notif_email"
        value={config.notif_email ?? ''}
        label="Email de notification"
        type="email"
        placeholder="cep@cep.net"
      />
      <InlineField
        configId={config.id}
        field="notif_email_smtp_host"
        value={config.notif_email_smtp_host ?? ''}
        label="Hôte SMTP"
        placeholder="smtp.example.com"
      />
      <InlineField
        configId={config.id}
        field="notif_email_smtp_port"
        value={config.notif_email_smtp_port ?? 587}
        label="Port SMTP"
        type="number"
        min={0}
      />
      <InlineField
        configId={config.id}
        field="notif_email_smtp_encryption"
        value={config.notif_email_smtp_encryption ?? ''}
        label="Chiffrement SMTP"
        placeholder="tls"
      />
      <InlineField
        configId={config.id}
        field="notif_email_from_name"
        value={config.notif_email_from_name ?? ''}
        label="Nom expéditeur"
        placeholder="SEGAR"
      />
      <InlineField
        configId={config.id}
        field="whatsapp_instance"
        value={config.whatsapp_instance ?? ''}
        label="Instance WhatsApp"
        placeholder="2522545522"
      />
      <InlineField
        configId={config.id}
        field="whatsapp_number_id"
        value={config.whatsapp_number_id ?? ''}
        label="WhatsApp Number ID"
        placeholder="..."
      />
    </div>
  )
}