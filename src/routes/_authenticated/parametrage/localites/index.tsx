import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/parametrage/localites/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/parametrage/localites/"!</div>
}
