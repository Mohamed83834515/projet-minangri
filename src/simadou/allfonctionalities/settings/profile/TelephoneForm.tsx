import { DynamicForm } from '@/Global/Forms/DynamicForm'
import { getPhoneFormConfig } from '@/simadou/allfieldsConfig/personalPhone'
import { UpdateTelephoneInput, UpdateTelephoneSchema } from '@/simadou/schemas/personnelSchema'



type Props = {
  currentValue?: string   
  onSuccess:     (data: UpdateTelephoneInput) => void
  isPending:     boolean
}

const TelephoneForm = ({ currentValue, onSuccess, isPending }: Props) => {
     const formConfig = getPhoneFormConfig();
      const handleSubmit = (data : UpdateTelephoneInput) => {
    onSuccess(data)

  }
  return (
     <DynamicForm
      config={formConfig}
      schema={UpdateTelephoneSchema}
      
     defaultValues={{
    contact_perso : currentValue,
  }}
      onSubmit={handleSubmit}
      isLoading={isPending}
      submitText="Enregistrer"
      loadingText="Enregistrement..."
    />
  )
}

export default TelephoneForm