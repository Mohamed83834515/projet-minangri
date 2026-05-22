import { createFileRoute } from '@tanstack/react-router'
// import { ConfigDrawer } from '@/components/config-drawer'
// import { Header } from '@/components/layout/others/header'
// import { ProfileDropdown } from '@/components/profile-dropdown'
// import { Search } from '@/components/search'
// import { ThemeSwitch } from '@/components/theme-switch'
import { ForbiddenError } from '@/simadou/allfonctionalities/errors/forbidden'
import { GeneralError } from '@/simadou/allfonctionalities/errors/general-error'
import { MaintenanceError } from '@/simadou/allfonctionalities/errors/maintenance-error'
import { NotFoundError } from '@/simadou/allfonctionalities/errors/not-found-error'
import { UnauthorisedError } from '@/simadou/allfonctionalities/errors/unauthorized-error'

export const Route = createFileRoute('/_authenticated/errors/$error')({
  component: RouteComponent,
})

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  const { error } = Route.useParams()

  const errorMap: Record<string, React.ComponentType> = {
    unauthorized: UnauthorisedError,
    forbidden: ForbiddenError,
    'not-found': NotFoundError,
    'internal-server-error': GeneralError,
    'maintenance-error': MaintenanceError,
  }
  const ErrorComponent = errorMap[error] || NotFoundError

  return (
    <>
      {/* <Header fixed className='border-b'>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header> */}
      <div className='flex-1 [&>div]:h-full'>
        <ErrorComponent />
      </div>
    </>
  )
}
