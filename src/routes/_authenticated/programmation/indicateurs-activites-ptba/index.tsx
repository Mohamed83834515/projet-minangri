import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/programmation/indicateurs-activites-ptba/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      Hello "/_authenticated/programmation/indicateurs-activites-ptba/"!
    </div>
  )
}
