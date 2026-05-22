import { createFileRoute } from '@tanstack/react-router'
import { Otp } from '@/simadou/allfonctionalities/auth/otp'

export const Route = createFileRoute('/(auth)/otp')({
  component: Otp,
})
