import { UpdateTitleSchema, UpdateTitleInput } from '@/simadou/schemas/personnelSchema'
import { useTitres } from '@/simadou/allHooks/personnel/personnelHooks'
import { DynamicForm } from '@/Global/Forms/DynamicForm'
import { getTitleFormConfig } from '@/simadou/allfieldsConfig/personalTitleForm'
import { RichSelectOption } from '@/Global/Fields/FormField'

type Props = {
  currentValue?: string   
  onSuccess:     (data: UpdateTitleInput) => void
  isPending:     boolean
}

export function TitleForm({ currentValue, onSuccess, isPending }: Props) {
  const { data: titres=[], isLoading } = useTitres()
   const titleOptions: RichSelectOption[] = titres?.map((t) => ({
    label: t.libelle_titre,
    value: String(t.id_titre),
  }));

 const formConfig = getTitleFormConfig({options : titleOptions, disabled :isLoading});

 const defaultTitleValue =
  titleOptions.find((t) => t.label === currentValue)?.value ?? ""

  
  const handleSubmit = (data : UpdateTitleInput) => {
   onSuccess(data)
  }

 

  return (
    <>
    
    <DynamicForm
              config={formConfig}
              schema={UpdateTitleSchema}
              
              defaultValues={{titre_personnel : defaultTitleValue}}
              onSubmit={handleSubmit}
              isLoading={isPending}
              submitText="Enregistrer"
              loadingText="Enregistrement..."
            />
   
    </>
   
  )
}