import { useState, type ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DIALOG_SIZES } from '@/Global/Forms/dialog'
import type { Ptba } from '@/simadou/allTypes'
import { activiteModalTitle } from './activite-modal-utils'
import { ActiviteTabbedDialogProvider } from './ActiviteTabbedDialogContext'

export type ActiviteTabConfig = {
  value: string
  label: string
  content: ReactNode
}

type ActiviteTabbedDialogProps = {
  activite: Ptba | null
  open: boolean
  onOpenChange: (open: boolean) => void
  tabs: ActiviteTabConfig[]
  defaultTab?: string
  title?: string
}

export default function ActiviteTabbedDialog({
  activite,
  open,
  onOpenChange,
  tabs,
  defaultTab,
  title,
}: ActiviteTabbedDialogProps) {
  const [subViewActive, setSubViewActive] = useState(false)
  const initialTab = defaultTab ?? tabs[0]?.value ?? ''

  const handleOpenChange = (next: boolean) => {
    if (!next) setSubViewActive(false)
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={`${DIALOG_SIZES.full} max-h-[95vh] overflow-y-auto`}
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>
            {title ?? activiteModalTitle(activite, 'Activité')}
          </DialogTitle>
        </DialogHeader>

        {activite && tabs.length > 0 && (
          <ActiviteTabbedDialogProvider setSubViewActive={setSubViewActive}>
            <Tabs
              key={activite.id_ptba}
              defaultValue={initialTab}
              className='w-full'
            >
              {!subViewActive && (
                <TabsList className='flex h-auto w-full flex-wrap gap-1'>
                  {tabs.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              )}

              {tabs.map((tab) => (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className='max-h-[min(70vh,800px)] overflow-y-auto'
                >
                  {tab.content}
                </TabsContent>
              ))}
            </Tabs>
          </ActiviteTabbedDialogProvider>
        )}
      </DialogContent>
    </Dialog>
  )
}
