import type { ProjetDetailTab } from './projetDetailTabs'

type ProjetDetailTabPanelProps = {
  tab: ProjetDetailTab
}

/** Zone de contenu principal — modules branchés plus tard. */
export default function ProjetDetailTabPanel({ tab }: ProjetDetailTabPanelProps) {
  const Icon = tab.icon

  return (
    <div className='flex min-h-[480px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed bg-muted/20 p-10 text-center'>
      <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary'>
        <Icon className='h-6 w-6' />
      </div>
      <div className='max-w-md space-y-1'>
        <h3 className='text-lg font-semibold'>{tab.name}</h3>
        <p className='text-sm text-muted-foreground'>{tab.description}</p>
        <p className='text-xs text-muted-foreground'>
          Module à brancher (liste, formulaires et API).
        </p>
      </div>
    </div>
  )
}
