import { ResetPassword } from '@/simadou/allfonctionalities/auth/reset-password'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/reset-password/$uid/$token')({
  component: ResetPassword,
})

