import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/parametrage/acteurs/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/parametrage/acteurs/"!</div>
}
