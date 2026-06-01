import { RichSelectOption } from '@/Global/Fields/FormField';
import { DynamicForm } from '@/Global/Forms/DynamicForm'
import { getRegionFormConfig } from '@/simadou/allfieldsConfig/personalRegion';
import {  useRegions } from '@/simadou/allHooks/personnel/personnelHooks';
import { UpdateRegionInput, UpdateRegionSchema } from '@/simadou/schemas/personnelSchema';


type Props = {
  currentValue?: string   
  onSuccess:     (data: UpdateRegionInput) => void
  isPending:     boolean
}


const RegionForm = ({ currentValue, onSuccess, isPending }: Props) => {

  const {data : regions=[], isLoading}= useRegions()
 
  const regionOptions: RichSelectOption[] = regions.map((region) => ({
  label: region.intitule_loca,
  value: String(region.id_loca),
}));

     const formConfig = getRegionFormConfig({options : regionOptions, disabled : isLoading});
          const handleSubmit = (data : UpdateRegionInput ) => {
           
           onSuccess(data)
      }

      const defaultRegionValue =
  regionOptions.find((r) => r.label === currentValue)?.value ?? ""
       console.log("options ", regionOptions)
      console.log(regionOptions.find(r => r.label === currentValue))
  return (
      <DynamicForm
                     config={formConfig}
                     schema={UpdateRegionSchema}
                     
                      defaultValues={{
    region_perso: defaultRegionValue,
  }}
                     onSubmit={handleSubmit}
                     isLoading={isPending}
                     submitText="Enregistrer"
                     loadingText="Enregistrement ..."
                   />
  )
}

export default RegionForm