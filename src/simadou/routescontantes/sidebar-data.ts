import {
  LayoutGrid,
  Command,
  LayoutDashboard,
  Wallet,
  Activity,
  ListTodo,
  TrendingUp,
  Handshake,
  BarChart,
  Target,
  Files,
  ShieldAlert,
  BookOpen,
  CalendarClock,
  ClipboardCheck,
  UserCog,
  MapPin,
  Settings,
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
      title: 'Mon Projet',
      items: [
        { title: 'Tableau de bord', url: '/', icon: LayoutDashboard },
        {
          title: 'Paramétrage',
          icon: Settings,
          items: [
            {
              title: 'Localités',
              url: '/parametrage/localites',
              icon: MapPin,
            },
            {
              title: 'Utilisateurs',
              url: '/parametrage/utilisateurs',
              icon: UserCog,
            },
          ],
        },
        {
          title: 'Cadre de Résultats',
          icon: BookOpen,
          items: [
            { title: 'Activités (Plan analytique)', url: '/activites', icon: Activity },
            { title: 'Cadre de Résultats', url: '/cadre-resultats', icon: BarChart },
            { title: 'Financement', url: '/financement', icon: Wallet },
            { title: 'Indicateurs CMR', url: '/indicateurs-cmr', icon: Target },
          ],
        },
        {
          title: 'Programmation',
          icon: CalendarClock,
          items: [
            { title: 'PTBA', url: '/ptba', icon: ListTodo },
            { title: 'Conventions', url: '/conventions', icon: Handshake },
            { title: 'Points de blocage', url: '/points-blocage', icon: ShieldAlert },
          ],
        },
        {
          title: 'Suivi des Résultats',
          icon: ClipboardCheck,
          items: [
            { title: 'Suivi du PTBA', url: '/suivi-ptba', icon: TrendingUp },
            { title: 'Documents', url: '/documents', icon: Files },
          ],
        },
      ],
    },
    {
      title: 'Paramètres',
      items: [
        {
          title: 'Unités de gestion',
          url: '/projet-programme/unites-de-gestion',
          icon: LayoutGrid,
        },
      ],
    },
  ],
}
