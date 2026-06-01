import { RichSelectOption } from "@/Global/Fields/FormField";
import type { FormConfig } from "../../Global/types/formConfig";

export const getRegionFormConfig = ({options, disabled} : {options :RichSelectOption[], disabled : boolean}): FormConfig => ({
    fields : [
        {
             name: "region_perso",
            label: "Région",
            type: "select",
           options ,
            gridCols: 1,
            disabled
        }
    ]
})