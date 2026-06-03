// routes/_authenticated/parametrage/localites/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { MapPin, Layers3 } from 'lucide-react'
import { PageRouteLayout } from '@/Global/HookRoute/genericRoute'
import ListeLocalite from '@/simadou/allfonctionalities/parametrage/localite/ListeLocalite'
import NiveauLocaliteDialog from '@/simadou/allfonctionalities/parametrage/localite/niveau/NiveauDialog'
import { useState } from 'react'
import AddLocalite from '@/simadou/allfonctionalities/parametrage/localite/AddLocalite'
import { LocaliteProvider } from '@/simadou/allContext/niveauLocalite'

export const Route = createFileRoute('/_authenticated/parametrage/localites/')({
  component: RouteComponent,
})


function RouteComponent() {
  const [refreshKey, setRefreshKey] = useState(0)
  return (
    <LocaliteProvider>
    <PageRouteLayout
      title="Localités"
      boutonAddTitle="Ajouter une localité"
      addDialogComponent={AddLocalite}  // ✅ Pas de dialog d'ajout global
      icon={MapPin}
      listComponent={ListeLocalite}
      extraButtons={[
        {
          title: "Configuration Niveaux",
          icon: Layers3,
          dialogComponent: NiveauLocaliteDialog,
        },
      ]}
    />
    </LocaliteProvider>
  )
}