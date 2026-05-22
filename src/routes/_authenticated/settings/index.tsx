import { createFileRoute } from '@tanstack/react-router'
import { SettingsProfile } from '@/simadou/allfonctionalities/settings/profile'

export const Route = createFileRoute('/_authenticated/settings/')({
  component: SettingsProfile,
})
