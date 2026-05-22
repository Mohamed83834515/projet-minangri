import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Check, ChevronDown, FolderKanban } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { type Project, useProjectStore } from '@/stores/projetct-store'

interface ProjectSwitcherProps {
  onHeader?: boolean
}

export function ProjectSwitcher({ onHeader = false }: ProjectSwitcherProps) {
  const { activeProject, projects, setActiveProject } = useProjectStore()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const handleSelect = (project: Project) => {
    setActiveProject(project)
    queryClient.invalidateQueries()
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='flex items-center gap-2 max-w-[200px]'
          style={
            onHeader
              ? {
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderColor: 'rgba(255,255,255,0.25)',
                  color: 'var(--header-text)',
                }
              : {}
          }
        >
          <FolderKanban
            className='h-4 w-4 shrink-0'
            style={onHeader ? { color: 'var(--header-text)' } : { color: 'var(--primary)' }}
          />
          <span className='truncate text-xs font-semibold'>
            {activeProject?.code ?? 'Projet'}
          </span>
          <ChevronDown className='h-3 w-3 shrink-0 opacity-50' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-80'>
        <DropdownMenuLabel className='text-xs text-muted-foreground font-normal'>
          Programme actif
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {projects.length === 0 && (
          <div className='px-3 py-4 text-center text-sm text-muted-foreground'>
            Aucun projet disponible
          </div>
        )}

        {projects.map((project) => {
          const isActive = activeProject?.id === project.id
          return (
            <DropdownMenuItem
              key={project.id}
              onClick={() => handleSelect(project)}
              className={cn(
                'flex flex-col items-start gap-1 p-3 cursor-pointer rounded-md my-0.5',
                isActive &&
                  'bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground'
              )}
            >
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-2'>
                  {isActive && <Check className='h-3 w-3 shrink-0' />}
                  <span className='font-semibold text-sm'>{project.code}</span>
                </div>
                <Badge
                  variant={isActive ? 'secondary' : 'outline'}
                  className='text-[10px] px-1.5 py-0'
                >
                  Période : {project.periode}
                </Badge>
              </div>
              <span
                className={cn(
                  'text-xs',
                  isActive ? 'text-primary-foreground/90' : 'text-foreground'
                )}
              >
                {project.nom}
              </span>
              <span
                className={cn(
                  'text-[11px]',
                  isActive ? 'text-primary-foreground/60' : 'text-muted-foreground'
                )}
              >
                {project.description}
              </span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}