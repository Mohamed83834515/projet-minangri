import {
  FolderOpen,
  CalendarDays,
  LayoutGrid,
  Command,
  LayoutDashboard,
} from 'lucide-react'
import { type SidebarData } from '../../components/layout/others/types'

export const sidebarData: SidebarData = {
  user: {
    name: "Simadou",
    email: "hello@gmail.com",
    id: "zofmov",
    statut: 1
  },
  teams: [
    {
      name: 'SIMANDOU',
      logo: Command,
      plan: 'agriculture',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Tableau de bord',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Projets / Programmes',
          icon: CalendarDays,
          items: [
            {
              title: 'Liste des projets',
              url: '/projet-programme/projets',
              icon: FolderOpen,
            },
            {
              title: 'Unités de gestion',
              url: '/projet-programme/unites-de-gestion',
              icon: LayoutGrid,
            },
          ],
        },
      ],
    },
  ],
}
