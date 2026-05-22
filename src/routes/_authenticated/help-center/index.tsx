import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '@/components/others/coming-soon'

export const Route = createFileRoute('/_authenticated/help-center/')({
  component: ComingSoon,
})
