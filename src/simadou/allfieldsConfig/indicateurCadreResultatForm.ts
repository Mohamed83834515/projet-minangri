import type { FormConfig } from "../../Global/types/formConfig";

export const getIndicateurCadreResultatFormConfig = (): FormConfig => ({

    fields: [
        // number - Niveau IOP
        {
            name: "niveau_iop",
            label: "Niveau IOP",
            type: "number",
            placeholder: "Ex: 1, 2, 3...",
            required: true,
            min: 1,
            gridCols: 1,
        },
        // texte - Code indicateur CRP
        {
            name: "code_indicateur_cr_iop",
            label: "Code indicateur CRP",
            type: "text",
            placeholder: "Ex: IND001, IOP01...",
            required: true,
            gridCols: 1,
        },
        // texte - Code cadre résultat
        {
            name: "code_cr_iop",
            label: "Code cadre résultat",
            type: "text",
            placeholder: "Ex: CR001, CR01...",
            required: true,
            gridCols: 1,
        },
        // texte - Intitulé indicateur
        {
            name: "intitule_indicateur_cr_iop",
            label: "Intitulé indicateur",
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
            name: "source_iop",
            label: "Source",
            type: "text",
            placeholder: "Source des données",
            required: true,
            gridCols: 1,
        },
        // texte - Responsable
        {
            name: "responsable_iop",
            label: "Responsable",
            type: "text",
            placeholder: "Nom du responsable",
            required: true,
            gridCols: 1,
        },
        // textarea - Description
        {
            name: "description_iop",
            label: "Description",
            type: "textarea",
            placeholder: "Description détaillée de l'indicateur...",
            rows: 3,
            required: true,
            gridCols: 2,
        },
        // texte - Structure (optionnel)
        {
            name: "structure_iop",
            label: "Structure",
            type: "text",
            placeholder: "Structure associée (optionnel)",
            required: false,
            gridCols: 1,
        },
        // select - Projet (optionnel)
        {
            name: "projet_iop",
            label: "Projet",
            type: "select",
            placeholder: "Sélectionner un projet (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
    ]

})