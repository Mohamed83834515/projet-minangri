import { InlineField } from "./components/InlineFields"
import type { Configuration } from "@/simadou/schemas/configurations.schema"

export function SecuriteSection({ config }: { config: Configuration }) {
  return (
    <div className="flex flex-col gap-4">
      <InlineField
        configId={config.id}
        field="is_maintenance"
        value={config.is_maintenance ?? false}
        label="Mode maintenance"
        type="switch"
        helperText="Seul le super admin a accès pendant cette période"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <InlineField
          configId={config.id}
          field="inactivity_minute"
          value={config.inactivity_minute ?? 30}
          label="Délai d'inactivité (min)"
          type="number"
          min={0}
          helperText="0 = illimité"
        />
        <InlineField
          configId={config.id}
          field="max_sessions"
          value={config.max_sessions ?? 2}
          label="Sessions simultanées max"
          type="number"
          min={0}
          helperText="0 = illimité"
        />
        <InlineField
          configId={config.id}
          field="max_login_attempts"
          value={config.max_login_attempts ?? 3}
          label="Tentatives de connexion max"
          type="number"
          min={0}
          helperText="0 = illimité"
        />
        <InlineField
          configId={config.id}
          field="otp_validity_minute"
          value={config.otp_validity_minute ?? 5}
          label="Validité code OTP (min)"
          type="number"
          min={0}
          helperText="0 = non exigé"
        />
        <InlineField
          configId={config.id}
          field="password_expiry_month"
          value={config.password_expiry_month ?? 6}
          label="Expiration mot de passe (mois)"
          type="number"
          min={0}
          helperText="0 = non exigé"
        />
        <InlineField
          configId={config.id}
          field="delay_update_second"
          value={config.delay_update_second ?? 5}
          label="Délai avant suppression (sec)"
          type="number"
          min={0}
          helperText="0 = non exigé"
        />
      </div>
    </div>
  )
}