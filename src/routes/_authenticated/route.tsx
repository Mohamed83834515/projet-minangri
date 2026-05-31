import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/others/authenticated-layout'

import { requireAuth } from '@/simadou/authGuard'

export const Route = createFileRoute('/_authenticated')({
   beforeLoad : requireAuth,
  component: AuthenticatedLayout,
 
})
