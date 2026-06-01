import { Button } from "@/components/ui/button"
import { DynamicForm } from "@/Global/Forms/DynamicForm"
import { getTypeActiviteFormConfig } from "@/simadou/allfieldsConfig/typeActiviteForm"
import { useSaveTypeActivite } from "@/simadou/allHooks/admin/typeActivitesHooks"
import { TypeActivite } from "@/simadou/allTypes/entities"
import { typeActiviteSchema } from "@/simadou/schemas/ptbaSchemas"

type Props = {
  currentRow?: TypeActivite | null
  onBack: () => void
  onSuccess: () => void
  onCancel: () => void
}

export default function AddTypeActivite({
  currentRow,
  onBack,
  onSuccess,
  onCancel,
}: Props) {
  const isEdit = !!currentRow

  const formConfig = getTypeActiviteFormConfig()

  const defaultValues = {
    code_type: currentRow?.code_type || "",
    intutile_type: currentRow?.intutile_type || "",
    description: currentRow?.description || "",
  }

  const mutation = useSaveTypeActivite(isEdit, currentRow, onSuccess)

  const handleSubmit = (data: any) => {
    mutation.mutate(data)
  }

  return (
    <DynamicForm
      config={formConfig}
      schema={typeActiviteSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      isLoading={mutation.isPending}
      submitText={isEdit ? "Modifier" : "Ajouter"}
      loadingText="Enregistrement..."
      onCancel={onBack}
      cancelText='Retour'
    />
  )
}