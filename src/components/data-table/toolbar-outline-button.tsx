import { PlusCircledIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type DataTableToolbarOutlineButtonProps = {
  children: React.ReactNode
  onClick: () => void
  className?: string
}

/** Matches the dashed outline style used by faceted filters (e.g. Version PTBA). */
export function DataTableToolbarOutlineButton({
  children,
  onClick,
  className,
}: DataTableToolbarOutlineButtonProps) {
  return (
    <Button
      type='button'
      variant='outline'
      size='sm'
      className={cn('h-8 border-dashed', className)}
      onClick={onClick}
    >
      <PlusCircledIcon className='size-4' />
      {children}
    </Button>
  )
}
