import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/programme/liste/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/programme/liste/"!</div>
}
