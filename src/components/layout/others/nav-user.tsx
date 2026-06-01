import { Link } from '@tanstack/react-router'
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  EllipsisVertical,
  LogOut,
  MessageCircleWarning,
  ShieldCog
} from 'lucide-react'
import useDialogState from '@/hooks/use-dialog-state'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { SignOutDialog } from '@/components/others/sign-out-dialog'
import { Badge } from '@/components/ui/badge'


type NavUserProps = {
  user: {
    name: string | undefined
    email: string
    id: string
    statut : number
  }
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar()
  const [open, setOpen] = useDialogState()

  // const {mutate : logout, isPending} = useLogout()

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage src={'/'} alt={user.name} />
                  <AvatarFallback className='rounded-lg'>DT</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-start text-sm leading-tight'>
                  <span className='truncate font-semibold'>{user.name}</span>
                  <span className='truncate text-xs'>{user.email}</span>
                </div>
                <EllipsisVertical className='ms-auto size-4' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
              side={isMobile ? 'bottom' : 'right'}
              align='end'
              sideOffset={4}
            >
              <DropdownMenuLabel className='p-0 font-normal'>
                <div className="flex flex-col items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="w-16 h-16 border shadow-md">
              <AvatarImage src={""} />
              <AvatarFallback className="text-2xl font-bold text-foreground bg-primary/40">
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

                <div className="flex-1 space-y-2 text-center">

      <Badge 
      
      className={`px-3 py-1 text-xs rounded-full font-medium ${
        user?.statut===1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`} 
      variant='secondary'
      >
        {user?.statut===1  
        ? (
   <>
    <BadgeCheck className="h-4 w-4" data-icon="inline-start" />
        Compte actif
   </>
        ) 
        :  (
          <>
         <MessageCircleWarning className="h-4 w-4" data-icon="inline-start" />
         Action requise
          </>
        )}
       
      </Badge>

    
      <span className="px-3 py-1 text-xs rounded-full bg-muted">
        {user?.email}
      </span>

     
   
  </div>
              </div>


               
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                
                <DropdownMenuItem asChild
                className='cursor-pointer border mt-3 rounded-full px-4 py-2 font-semibold flex items-center justify-center text-primary hover:opacity-50'
                >
                  <Link to='/settings'>
                    <ShieldCog />
                   Gérez votre compte 
                  </Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem asChild>
                  <Link to='/settings'>
                    <CreditCard />
                    Billing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to='/settings/notifications'>
                    <Bell />
                    Notifications
                  </Link>
                </DropdownMenuItem> */}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant='destructive'
                onClick={() => setOpen(true)}
              >
                <LogOut />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
