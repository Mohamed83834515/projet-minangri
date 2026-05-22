import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/parametrage/dictionnaire-indicateurs/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Hello "/_authenticated/parametrage/dictionnaire-indicateurs/"!</div>
  )
}
