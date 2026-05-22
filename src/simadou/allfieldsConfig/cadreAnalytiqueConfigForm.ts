import type { FormConfig } from "../../Global/types/formConfig";

export const getNiveauCadreAnalytiqueFormConfig = (): FormConfig => ({

    fields: [
        // number - Nombre niveau
        {
            name: "nombre_nca",
            label: "Nombre niveau",
            type: "number",
            placeholder: "Ex: 1, 2, 3...",
            required: true,
            min: 1,
            gridCols: 1,
        },
        // texte - Libellé niveau
        {
            name: "libelle_nca",
            label: "Libellé niveau",
            type: "text",
            placeholder: "Ex: Axe, Sous-axe, Activité...",
            required: true,
            gridCols: 2,
        },
        // number - Code number niveau
        {
            name: "code_number_nca",
            label: "Code number niveau",
            type: "number",
            placeholder: "Ex: 01, 02, 03...",
            required: true,
            min: 0,
            gridCols: 1,
        },
        // select - Programme (optionnel)
        {
            name: "programme",
            label: "Programme",
            type: "select",
            placeholder: "Sélectionner un programme (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
    ]

})