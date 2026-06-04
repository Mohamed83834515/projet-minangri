 
import { createFileRoute } from '@tanstack/react-router'
import ListeLocalite from '@/simadou/allfonctionalities/parametrage/localite/ListeLocalite'

export const Route = createFileRoute('/_authenticated/parametrage/localites/')({
  component: ListeLocalite,
})

// function RouteComponent() {
//   return (
//     <PageRouteLayout
//       title="Localités"
//       icon={MapPin}
//       showAddButton={false}
//       listComponent={ListeLocalite}
//     />
//   )
// }