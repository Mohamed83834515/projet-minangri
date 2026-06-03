import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import TypeZoneDialog from '@/simadou/allfonctionalities/parametrage/autres/type-zones/TypeZoneDialog'
import UniteIndicateurDialog from '@/simadou/allfonctionalities/parametrage/autres/unite-indicateurs/UniteIndicateurDialog'
import { createFileRoute } from '@tanstack/react-router'
import { MapPin, Ruler, Settings } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/_authenticated/parametrage/autres/')({
  component: AutresParametragesPage,
})


function AutresParametragesPage() {
  const [uniteDialogOpen, setUniteDialogOpen] = useState(false)
  const [typeZoneDialogOpen, setTypeZoneDialogOpen] = useState(false)

  const paramCards = [
    {
      title: "Unités d'indicateur",
      description: "Gérer les unités de mesure pour les indicateurs (%, Kg, Nombre, etc.)",
      icon: Ruler,
      onClick: () => setUniteDialogOpen(true),
      dialog: UniteIndicateurDialog,
      dialogOpen: uniteDialogOpen,
      setDialogOpen: setUniteDialogOpen,
    },
    {
      title: "Types de zones",
      description: "Gérer les types de zones géographiques (Région, District, etc.)",
      icon: MapPin,
      onClick: () => setTypeZoneDialogOpen(true),
      dialog: TypeZoneDialog,
      dialogOpen: typeZoneDialogOpen,
      setDialogOpen: setTypeZoneDialogOpen,
    },
  ]

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-muted-foreground" />
        <div>
          <h1 className="text-3xl font-bold">Autres paramétrages</h1>
          <p className="text-muted-foreground mt-1">
            Configuration des unités d'indicateur et types de zones
          </p>
        </div>
      </div>

      {/* Grille 2 colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paramCards.map((card) => (
          <Card key={card.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <card.icon className="h-6 w-6 text-primary" />
                  <CardTitle>{card.title}</CardTitle>
                </div>
                <Button variant="outline" size="sm" onClick={card.onClick}>
                  Gérer
                </Button>
              </div>
              <CardDescription className="mt-2">
                {card.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Cliquez sur "Gérer" pour ajouter, modifier ou supprimer des éléments.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialogues */}
      {paramCards.map((card) => (
        <card.dialog
          key={card.title}
          open={card.dialogOpen}
          onOpenChange={card.setDialogOpen}
        />
      ))}
    </div>
  )
}