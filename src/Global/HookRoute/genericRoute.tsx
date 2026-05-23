import { Button } from "@/components/ui/button";
import { CHART_COLORS, useColor } from "@/stores/others/color-store";
import type { LucideIcon } from "lucide-react";
import { useState, type ComponentType } from 'react';

interface PageRouteLayoutProps {
  title: string;
  boutonAddTitle?: string;
  icon: LucideIcon;
  /** Affiche le bouton d'ajout (défaut: true) */
  showAddButton?: boolean;
  // Dialog d'ajout (reçoit open + onOpenChange)
  addDialogComponent?: ComponentType<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }>;
  // Composant liste de la page
  listComponent: ComponentType;
}

// Layout générique pour les pages avec un titre, un bouton d'ajout et une liste
export function PageRouteLayout({
  title,
  boutonAddTitle = "Ajouter",
  icon: Icon,
  showAddButton = true,
  addDialogComponent: AddDialog,
  listComponent: ListComponent,
}: PageRouteLayoutProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { color } = useColor();
  const { stroke } = CHART_COLORS[color]; // Couleur dynamique selon le thème

  return (
    <div className="">
      <div className="flex items-center justify-between gap-4 p-4 rounded-lg mb-4">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-muted-foreground" />
          <h3>{title}</h3>
        </div>
        {showAddButton && AddDialog && (
          <div>
            <Button
              onClick={() => setShowAddDialog(true)}
              style={{ backgroundColor: stroke }}
              className="cursor-pointer hover:opacity-90 active:scale-100 text-white"
            >
              <Icon /> {boutonAddTitle}
            </Button>
            <AddDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
          </div>
        )}
      </div>
      <div className="px-4">
        <ListComponent />
      </div>
    </div>
  );
}