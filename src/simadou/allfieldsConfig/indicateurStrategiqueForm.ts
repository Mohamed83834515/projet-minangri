import type { FormConfig } from "../../Global/types/formConfig";

export const getIndicateurStrategiqueFormConfig = (): FormConfig => ({

    fields: [
        // number - Niveau indicateur stratégique
        {
            name: "niveau_istr",
            label: "Niveau indicateur stratégique",
            type: "number",
            placeholder: "Ex: 1, 2, 3...",
            required: true,
            min: 1,
            gridCols: 1,
        },
        // texte - Code indicateur stratégique
        {
            name: "code_indicateur_istr",
            label: "Code indicateur stratégique",
            type: "text",
            placeholder: "Ex: IND001, STR01...",
            required: true,
            gridCols: 1,
        },
        // texte - Code stratégique
        {
            name: "code_istr",
            label: "Code stratégique",
            type: "text",
            placeholder: "Ex: CS001, STRAT01...",
            required: true,
            gridCols: 1,
        },
        // texte - Intitulé indicateur stratégique
        {
            name: "intitule_indicateur_istr",
            label: "Intitulé indicateur stratégique",
            type: "text",
            placeholder: "Intitulé de l'indicateur",
            required: true,
            gridCols: 2,
        },
        // texte - Périodicité
        {
            name: "periodicite_iop",
            label: "Périodicité",
            type: "text",
            placeholder: "Ex: Mensuel, Trimestriel, Annuel...",
            required: true,
            gridCols: 1,
        },
        // texte - Source
        {
            name: "source_istr",
            label: "Source",
            type: "text",
            placeholder: "Source des données",
            required: true,
            gridCols: 1,
        },
        // texte - Responsable
        {
            name: "responsable_istr",
            label: "Responsable",
            type: "text",
            placeholder: "Nom du responsable",
            required: true,
            gridCols: 1,
        },
        // textarea - Description
        {
            name: "description_istr",
            label: "Description",
            type: "textarea",
            placeholder: "Description détaillée de l'indicateur...",
            rows: 3,
            required: true,
            gridCols: 2,
        },
        // texte - Structure
        {
            name: "structure_istr",
            label: "Structure",
            type: "text",
            placeholder: "Structure associée",
            required: true,
            gridCols: 1,
        },
        // select - Programme
        {
            name: "programme_istr",
            label: "Programme",
            type: "select",
            placeholder: "Sélectionner un programme",
            required: true,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
    ]

})