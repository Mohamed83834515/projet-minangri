import { FormConfig } from "@/Global/types/formConfig";


export const getPhoneFormConfig = (): FormConfig => ({
    fields : [
         {
             name: "contact_perso",
            label: "Téléphone",
            type: "tel",
        
            gridCols: 1,
         
        }
    ]
})