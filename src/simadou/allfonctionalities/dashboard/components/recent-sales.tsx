import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CHART_COLORS, useColor } from '@/stores/others/color-store'

const sales = [
  { initials: 'OM', src: '/avatars/01.png', name: 'Olivia Martin',   email: 'olivia.martin@email.com',  amount: '+$1,999.00' },
  { initials: 'JL', src: '/avatars/02.png', name: 'Jackson Lee',     email: 'jackson.lee@email.com',    amount: '+$39.00'    },
  { initials: 'IN', src: '/avatars/03.png', name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com',amount: '+$299.00'   },
  { initials: 'WK', src: '/avatars/04.png', name: 'William Kim',     email: 'will@email.com',           amount: '+$99.00'    },
  { initials: 'SD', src: '/avatars/05.png', name: 'Sofia Davis',     email: 'sofia.davis@email.com',    amount: '+$39.00'    },
]

export function RecentSales() {
  //couleur active
  const { color } = useColor()              
  //récupère le hex
  const { stroke } = CHART_COLORS[color]   

  return (
    <div className='space-y-8'>
      {sales.map(({ initials, src, name, email, amount }) => (
        <div key={email} className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src={src} alt='Avatar' />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-wrap items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-sm leading-none font-medium'>{name}</p>
              <p className='text-sm text-muted-foreground'>{email}</p>
            </div>
              {/*couleur dynamique */}
            <div className='font-medium' style={{ color: stroke }}>  
              {amount}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}