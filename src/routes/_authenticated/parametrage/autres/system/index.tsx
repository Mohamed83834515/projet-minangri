import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { AppWindow, Mail, Coins, ShieldCheck, Bell, Link2, Star, Settings, Plus } from 'lucide-react'
import { useConfigurations, useDefaultConfiguration } from '@/simadou/allHooks/configurations/configurationHooks'
import { useColor, HEADER_COLORS } from '@/stores/others/color-store'
import { IdentiteSection } from '@/simadou/allfonctionalities/parametrage/autres/system/IdentiteSection'
import { ContactsSection }      from '@/simadou/allfonctionalities/parametrage/autres/system/ContactsSection'
import { FinanceSection }       from '@/simadou/allfonctionalities/parametrage/autres/system/FinanceSection'
import { SecuriteSection }      from '@/simadou/allfonctionalities/parametrage/autres/system/SecuritySection'
import { NotificationsSection } from '@/simadou/allfonctionalities/parametrage/autres/system/NotificationsSection'
import { IntegrationsSection }  from '@/simadou/allfonctionalities/parametrage/autres/system/IntegrationsSection'
import { ConfigurationCard } from '@/simadou/allfonctionalities/parametrage/autres/system/components/ConfigurationCard'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Configuration } from '@/simadou/schemas/configurations.schema'
import { CreateConfigurationModal } from '@/simadou/allfonctionalities/parametrage/autres/system/components/CreateConfigurationModal'

export const Route = createFileRoute(
  '/_authenticated/parametrage/autres/system/'
)({ component: SystemPage })

const TABS = [
  { id: 'identite',      label: 'Identité',       icon: AppWindow   },
  { id: 'contacts',      label: 'Contacts',        icon: Mail        },
  { id: 'finance',       label: 'Finance',         icon: Coins       },
  { id: 'securite',      label: 'Sécurité',        icon: ShieldCheck },
  { id: 'notifications', label: 'Notifications',   icon: Bell        },
  { id: 'integrations',  label: 'Intégrations',    icon: Link2       },
] as const

type TabId = typeof TABS[number]['id']

// routes/_authenticated/parametrage/autres/system/index.tsx
// needs to be split — the system page should be master-detail

// The full page:
function SystemPage() {
  const [selectedId,    setSelectedId]    = useState<number | null>(null)
  const [activeTab,     setActiveTab]     = useState<TabId>('identite')
  const [modalOpen,     setModalOpen]     = useState(false)
  const [sourceConfig,  setSourceConfig]  = useState<Configuration | null>(null)

  const { data: configs = [], isLoading } = useConfigurations()
  const { data: defaultConfig }           = useDefaultConfiguration()
  const { headerColor }                   = useColor()
  const { bg }                            = HEADER_COLORS[headerColor]

  // Auto-select default on first load
  useEffect(() => {
    if (!selectedId && defaultConfig) setSelectedId(defaultConfig.id)
  }, [defaultConfig])

  const selectedConfig = configs.find(c => c.id === selectedId) ?? null

  const handleDuplicate = (config: Configuration) => {
    setSourceConfig(config)
    setModalOpen(true)
  }

  const handleNewConfig = () => {
    setSourceConfig(null)
    setModalOpen(true)
  }

  return (
    <div className="flex gap-6 pt-6 h-full">

      {/* ── Left panel ── */}
      <aside className="flex w-56 flex-shrink-0 flex-col gap-3">

        {/* Add button */}
        <Button
          size="sm"
          className="w-full gap-2"
          onClick={handleNewConfig}
        >
          <Plus className="size-4" />
          Nouvelle configuration
        </Button>

        {/* Config list */}
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : configs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Settings className="size-8 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">
                Aucune configuration
              </p>
            </div>
          ) : (
            <div className="space-y-2 pr-1">
              {configs.map(config => (
                <ConfigurationCard
                  key={config.id}
                  config={config}
                  isSelected={config.id === selectedId}
                  onSelect={() => setSelectedId(config.id)}
                  onDuplicate={handleDuplicate}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </aside>

      <Separator orientation="vertical" className="h-auto" />

      {/* ── Right panel ── */}
      <div className="flex flex-1 flex-col min-w-0">
        {!selectedConfig ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Sélectionnez une configuration
            </p>
          </div>
        ) : (
          <>
            {/* Config header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-medium">
                  {selectedConfig.structure_name ?? '—'}
                </h2>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {selectedConfig.structure_sigle ?? '—'}
                </span>
                {selectedConfig.is_default && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                    <Star className="size-3" />
                    Défaut
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Mis à jour le{' '}
                {new Date(selectedConfig.updated_at).toLocaleDateString('fr-FR')}
              </p>
            </div>

            {/* Vertical tabs */}
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as TabId)}
              orientation="vertical"
              style={{
                '--tab-active-bg':          bg,
                '--tab-active-color':       '#ffffff',
                '--tab-active-font-weight': '600',
              } as React.CSSProperties}
              className="flex flex-row items-start gap-0"
            >
              <TabsList className="
                sticky top-6 flex h-auto w-44 flex-shrink-0 flex-col
                items-stretch justify-start gap-0.5
                rounded-xl bg-muted p-1.5 self-start
              ">
                {TABS.map(({ id, label, icon: Icon }) => (
                  <TabsTrigger
                    key={id}
                    value={id}
                    className="
                      flex h-auto w-full items-center
                      justify-start gap-2.5
                      rounded-lg px-3 py-2.5 text-sm
                    "
                  >
                    <span className="
                      flex size-7 flex-shrink-0 items-center justify-center
                      rounded-md bg-background/60 shadow-sm
                    ">
                      <Icon className="size-3.5" aria-hidden />
                    </span>
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <Separator orientation="vertical" className="mx-4 h-auto" />

              <div className="flex-1 min-w-0">
                <TabsContent value="identite">
                  <IdentiteSection      config={selectedConfig} />
                </TabsContent>
                <TabsContent value="contacts">
                  <ContactsSection      config={selectedConfig} />
                </TabsContent>
                <TabsContent value="finance">
                  <FinanceSection       config={selectedConfig} />
                </TabsContent>
                <TabsContent value="securite">
                  <SecuriteSection      config={selectedConfig} />
                </TabsContent>
                <TabsContent value="notifications">
                  <NotificationsSection config={selectedConfig} />
                </TabsContent>
                <TabsContent value="integrations">
                  <IntegrationsSection  config={selectedConfig} />
                </TabsContent>
              </div>
            </Tabs>
          </>
        )}
      </div>

      {/* ── Creation modal ── */}
      <CreateConfigurationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        sourceConfig={sourceConfig}
        onSuccess={(created) => setSelectedId(created.id)}
      />

    </div>
  )
}


function SystemPageSkeleton() {
  return (
    <div className="flex flex-row items-start gap-0 pt-6">
      <div className="w-48 flex-shrink-0 space-y-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>
      <Separator orientation="vertical" className="mx-4 h-auto" />
      <div className="flex-1 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}