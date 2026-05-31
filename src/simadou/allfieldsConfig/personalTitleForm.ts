import { RichSelectOption } from "@/Global/Fields/FormField";
import type { FormConfig } from "../../Global/types/formConfig";

export const getTitleFormConfig = ({options, disabled} : {options :RichSelectOption[], disabled : boolean}): FormConfig => ({
    fields : [
               {
             name: "titre_personnel",
            label: "Titre",
            type: "select",
           options ,
            gridCols: 1,
            disabled
        }
    ]
})