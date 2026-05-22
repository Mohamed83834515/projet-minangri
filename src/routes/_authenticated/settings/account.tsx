import { createFileRoute } from '@tanstack/react-router'
import { SettingsAccount } from '@/simadou/allfonctionalities/settings/account'

export const Route = createFileRoute('/_authenticated/settings/account')({
  component: SettingsAccount,
})
