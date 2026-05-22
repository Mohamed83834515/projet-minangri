import type { FormConfig } from "../../Global/types/formConfig";

export const getNiveauStructureFormConfig = (): FormConfig => ({

    fields: [
        // number - Nombre niveau structure
        {
            name: "nombre_nsc",
            label: "Nombre niveau structure",
            type: "number",
            placeholder: "Ex: 1, 2, 3...",
            required: true,
            min: 1,
            gridCols: 1,
        },
        // texte - Libellé niveau structure
        {
            name: "libelle_nsc",
            label: "Libellé niveau structure",
            type: "text",
            placeholder: "Ex: Direction, Service, Cellule...",
            required: true,
            gridCols: 2,
        },
        // number - Code number niveau structure
        {
            name: "code_number_nsc",
            label: "Code number niveau structure",
            type: "number",
            placeholder: "Ex: 01, 02, 03...",
            required: true,
            min: 0,
            gridCols: 1,
        },
        // select - Programme (optionnel)
        {
            name: "id_programme",
            label: "Programme",
            type: "select",
            placeholder: "Sélectionner un programme (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
    ]

})