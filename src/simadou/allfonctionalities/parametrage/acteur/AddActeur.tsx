// simadou/allfonctionalities/parametrage/acteur/AddActeur.tsx
import { useMemo } from 'react'
import { DynamicForm } from '@/Global/Forms/DynamicForm'
import { useSaveActeur } from '@/simadou/allHooks/admin/acteurHooks'
import { Acteur, ActeurFormData } from '@/simadou/allTypes/acteur'
import { getActeurFormConfig } from '@/simadou/allfieldsConfig/acteurForm'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DIALOG_SIZES } from '@/Global/Forms/dialog'
import { acteurSchema } from '@/simadou/schemas/acteurSchema'
import { useGetCategoriesActeur } from '@/simadou/allHooks/admin/categorieActeurHooks'

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: Acteur | null
}

export default function AddActeur({
    open,
    onOpenChange,
    currentRow,
}: Props) {
    const isEdit = !!currentRow
    const {data : categorie_acteurs = []} = useGetCategoriesActeur()

    const formConfig = useMemo(() => {
        const config = getActeurFormConfig()

        // Transformer les localités en options pour les selects
        const categorieOptions = categorie_acteurs.map((cat: any) => ({
            label: cat.nom_categorie,
            value: cat.id_categorie,
        }))

        // Mettre à jour les options des champs select
        return {
            fields: config.fields.map((field) => {
                if (field.name === 'categorie_acteur') {
                    return { ...field, options: categorieOptions }
                }
                return field
            }),
        }
    }, [categorie_acteurs])

    const defaultValues = useMemo(() => {
        const categorie = currentRow?.categorie_acteur
        return {
            code_acteur: currentRow?.code_acteur || '',
            nom_acteur: currentRow?.nom_acteur || '',
            description_acteur: currentRow?.description_acteur || '',
            personne_responsable: currentRow?.personne_responsable || '',
            contact: currentRow?.contact || '',
            adresse_email: currentRow?.adresse_email || '',
            categorie_acteur: typeof categorie === 'object' && categorie !== null
                ? categorie.id_categorie
                : categorie || null,
        }
    }, [currentRow])

    const mutation = useSaveActeur(isEdit, currentRow, () => {
        onOpenChange(false)
    })

    const handleSubmit = (data: ActeurFormData) => {
        mutation.mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={DIALOG_SIZES.lg}>
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Modifier l'acteur" : "Ajouter un acteur"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Modification des informations de l'acteur"
                            : "Création d'un nouvel acteur"}
                    </DialogDescription>
                </DialogHeader>

                <DynamicForm
                    config={formConfig}
                    schema={acteurSchema}
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