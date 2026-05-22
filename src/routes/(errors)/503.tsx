import { createFileRoute } from '@tanstack/react-router'
import { MaintenanceError } from '@/simadou/allfonctionalities/errors/maintenance-error'

export const Route = createFileRoute('/(errors)/503')({
  component: MaintenanceError,
})
