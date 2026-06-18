import { DynamicForm } from "@/Global/Forms/DynamicForm"
import { getTypeProjetFormConfig } from "@/simadou/allfieldsConfig/typeProjetForm"
import { useSaveTypeProjet } from "@/simadou/allHooks/admin/typeProjetHooks"
import { TypeProjet } from "@/simadou/allTypes/typeProjet"
import { typeProjetSchema } from "@/simadou/schemas/typeProjetSchema"

type Props = {
  currentRow?: TypeProjet | null
  onBack: () => void
  onSuccess: () => void
  onCancel: () => void
}

export default function AddTypeProjet({
  currentRow,
  onBack,
  onSuccess,
}: Props) {
  const isEdit = !!currentRow

  const formConfig = getTypeProjetFormConfig()

  const defaultValues = {
    code_cat: currentRow?.code_cat || "",
    nom_categorie: currentRow?.nom_categorie || "",
    id_categorie: currentRow?.id_categorie || 0,
  }

  const mutation = useSaveTypeProjet(isEdit, currentRow, onSuccess)

  const handleSubmit = (data: TypeProjet) => {
    mutation.mutate(data)
  }
  return (
    <DynamicForm
      config={formConfig}
      schema={typeProjetSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      isLoading={mutation.isPending}
      submitText={isEdit ? "Modifier" : "Ajouter"}
      loadingText="Enregistrement..."
      onCancel={onBack}
      cancelText='Retour'
      embedded
    />
  )
}