
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'

import { useLayout } from '@/stores/others/layout-store'
import { CHART_COLORS, useColor } from '@/stores/others/color-store'
import { useMe } from '@/simadou/allHooks/auth/authHooks'
import simadouLogo from '@/assets/images/SimandouImg.png'
import { useFilteredSidebar } from '@/simadou/allHooks/admin/use-filtered-sidebar'
import { useProjetCode, useProjetIntitule } from '@/stores/projet-store'
export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { color } = useColor()
  const { stroke } = CHART_COLORS[color]
  const { data: user } = useMe()
  const sidebarData = useFilteredSidebar()
  return (
    <Sidebar
      collapsible={collapsible}
      variant={variant}
      style={{
        '--sidebar-primary': stroke,
        '--sidebar-accent': `${stroke}1A`,
        '--sidebar-accent-foreground': stroke,
        '--sidebar-ring': stroke,
      } as React.CSSProperties}
    >
      <SidebarHeader>
        <div className='flex items-start gap-4'>
          <div className='flex aspect-square size-8 items-center justify-center rounded-lg  text-sidebar-primary-foreground'>
            <img src={simadouLogo} className='size-4' />
          </div>
          <div className='grid flex-1 text-start text-sm leading-tight'>
            <span className='truncate font-semibold'>
              {useProjetIntitule() || "PDCVR"}
            </span>
            <span className='truncate text-xs'>{useProjetCode()}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <NavUser user={{ nom_perso: user.nom_perso ?? "Simadou", email: user.email ?? "hello@gmail.com", id_personnel_perso: user.id_personnel_perso ?? "4", statut: user.statut ?? 1, personnel_profile_picture: user.personnel_profile_picture, prenom_perso: user.prenom_perso }} />
        )}

      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}