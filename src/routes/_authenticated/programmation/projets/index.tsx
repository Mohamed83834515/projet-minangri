import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/programmation/projets/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/programmation/projets/"!</div>
}
