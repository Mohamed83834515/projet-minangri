import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DynamicForm } from '@/Global/Forms/DynamicForm'
import { getCreateConfigurationFormConfig } from '@/simadou/allfieldsConfig/configurationForm'
import { CreateConfigurationSchema } from '@/simadou/schemas/configurations.schema'
import { CONFIGURATION } from '@/simadou/allResetFields/resetField'
import { useCreateConfiguration } from '@/simadou/allHooks/configurations/configurationHooks'
import type { Configuration, CreateConfiguration } from '@/simadou/schemas/configurations.schema'

interface Props {
  open:          boolean
  onOpenChange:  (open: boolean) => void
  // if duplicating, pre-fill from source config
  sourceConfig?: Configuration | null
  onSuccess:     (created: Configuration) => void
}

export function CreateConfigurationModal({
  open,
  onOpenChange,
  sourceConfig,
  onSuccess,
}: Props) {
  const [resetKey, setResetKey] = useState(0)
  const formConfig = getCreateConfigurationFormConfig()

  const { mutate: createConfig, isPending } = useCreateConfiguration()

  const defaultValues: CreateConfiguration = {
    structure_name:  sourceConfig
      ? `${sourceConfig.structure_name} (copie)`
      : CONFIGURATION.structure_name,
    structure_sigle: sourceConfig
      ? `${sourceConfig.structure_sigle}_2`
      : CONFIGURATION.structure_sigle,
  }

  const handleSubmit = (data: CreateConfiguration) => {
    createConfig(data, {
      onSuccess: (created) => {
        onOpenChange(false)
        setResetKey(k => k + 1)
        onSuccess(created)
      },
    })
  }

  const handleClose = (open: boolean) => {
    if (!open) setResetKey(k => k + 1)
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {sourceConfig ? 'Dupliquer la configuration' : 'Nouvelle configuration'}
          </DialogTitle>
          {sourceConfig && (
            <p className="text-sm text-muted-foreground">
              Basée sur <span className="font-medium">{sourceConfig.structure_name}</span>.
              Les autres paramètres seront copiés automatiquement.
            </p>
          )}
        </DialogHeader>

        <DynamicForm
          key={resetKey}
          config={formConfig}
          schema={CreateConfigurationSchema}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isLoading={isPending}
          submitText={sourceConfig ? 'Dupliquer' : 'Créer'}
          loadingText="Création..."
          onCancel={() => handleClose(false)}
          cancelText="Annuler"
          embedded
        />
      </DialogContent>
    </Dialog>
  )
}