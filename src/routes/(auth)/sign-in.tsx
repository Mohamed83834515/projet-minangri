import { z } from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { SignIn } from '@/simadou/allfonctionalities/auth/sign-in'
import { authService } from '@/simadou/allSercices/authService'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/sign-in')({
  component: SignIn,
  beforeLoad: () => {
    // Redirect already-logged-in users away from sign-in
    if (authService.isAuthenticated()) {
      throw redirect({ to: '/', replace: true })
    }
  },
  validateSearch: searchSchema,
})
