import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/programmation/ptba/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/programmation/ptba/"!</div>
}
