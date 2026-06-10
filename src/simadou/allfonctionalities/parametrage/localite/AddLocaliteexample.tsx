// simadou/allfonctionalities/parametrage/localite/AddLocalite.tsx
import { useMemo } from 'react'
import { DynamicForm } from '@/Global/Forms/DynamicForm'
import { localiteSchema } from '@/simadou/schemas/localiteSchema'
import { useSaveLocalite, useGetLocalitesByParent } from '@/simadou/allHooks/admin/localiteHooks'
import { getLocaliteFormConfig } from '@/simadou/allfieldsConfig/localiteForm'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DIALOG_SIZES } from '@/Global/Forms/dialog'
import { useGetNiveauxLocalite } from '@/simadou/allHooks/admin/niveauLocaliteHooks'
import { Localite } from '@/simadou/allTypes/entities'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: any | null
  niveauId?: number
  onSuccess?: () => void  // ✅ Ajouter onSuccess dans les props
}

export default function AddLocaliteexemple({ open, onOpenChange, currentRow, niveauId=0, onSuccess }: Props) {
  const isEdit = !!currentRow
  const { data: niveaux = [] } = useGetNiveauxLocalite()

  // Trouver le niveau actuel et le niveau parent
  const currentNiveau = niveaux.find((n: any) => n.id_nlc === niveauId)
  const parentNiveau = niveaux.find((n: any) => n.nombre_nlc === (currentNiveau?.nombre_nlc || 0) - 1)

  // Récupérer les localités parentes pour le select
  const { data: parentData } = useGetLocalitesByParent(parentNiveau?.id_nlc || null)
  const parentLocalites = parentData || []

  // Configuration du formulaire avec options dynamiques
  const formConfig = useMemo(() => {
    const config = getLocaliteFormConfig()

    // Ajouter le champ parent si un niveau parent existe
    if (parentNiveau) {
      const parentOptions = parentLocalites.map((loc: any) => ({
        label: loc.intitule_loca,
        value: loc.id_loca,
      }))

      config.fields.push({
        name: 'parent_loca',
        label: parentNiveau.libelle_nlc,
        type: 'select',
        placeholder: `Sélectionner ${parentNiveau.libelle_nlc}`,
        required: false,
        options: parentOptions,
        colSpan: 'full',
      })
    }

    return config
  }, [parentNiveau, parentLocalites])

  // Valeurs par défaut
  const defaultValues = useMemo(() => ({
    code_loca: currentRow?.code_loca || '',
    code_national_loca: currentRow?.code_national_loca || '',
    intitule_loca: currentRow?.intitule_loca || '',
    parent_loca: typeof currentRow?.parent_loca === 'object'
      ? (currentRow.parent_loca as any).id_loca
      : currentRow?.parent_loca || null,
    niveau_loca: niveauId,
  }), [currentRow, niveauId])

  const mutation = useSaveLocalite(isEdit, currentRow, () => {
    onOpenChange(false)
    onSuccess?.()  // ✅ Appeler onSuccess après fermeture
  })

  const handleSubmit = (data: Localite) => {
    mutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={DIALOG_SIZES.md}>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Modifier' : 'Ajouter'} une {currentNiveau?.libelle_nlc?.toLowerCase()}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Modification des informations de la localité'
              : `Création d'une nouvelle localité au niveau ${currentNiveau?.libelle_nlc}`}
          </DialogDescription>
        </DialogHeader>

        <DynamicForm
          config={formConfig}
          schema={localiteSchema}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isLoading={mutation.isPending}
          submitText={isEdit ? 'Mettre à jour' : 'Ajouter'}
          loadingText='Enregistrement...'
        />
      </DialogContent>
    </Dialog>
  )
}