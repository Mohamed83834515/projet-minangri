import { createFileRoute } from '@tanstack/react-router'
import { Settings } from '@/simadou/allfonctionalities/settings'

export const Route = createFileRoute('/_authenticated/settings')({
  component: Settings,
})
