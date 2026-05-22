import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/parametrage/autres/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/parametrage/autres/"!</div>
}
