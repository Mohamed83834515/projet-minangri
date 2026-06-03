import type { FormConfig, SelectOption } from '@/Global/types/formConfig'

/** Formulaire cadre analytique — layout compact 2 colonnes (dialog). */
export function getCadreAnalytiqueFormConfigForDialog({
  parentOptions,
  acteurOptions,
  isLoadingActeurs,
  showParent,
  parentLabel = 'Parent',
  parentDisabled = false,
  codeLength,
}: {
  parentOptions: SelectOption[]
  acteurOptions: SelectOption[]
  isLoadingActeurs?: boolean
  showParent: boolean
  parentLabel?: string
  parentDisabled?: boolean
  codeLength: number
}): FormConfig {
  return {
    fields: [
        // texte - Code cadre analytique
        {
            name: "code_ca",
            label: "Code cadre analytique",
            type: "text",
            placeholder: "Ex: CA001, CA01...",
            required: true,
            gridCols: 1,
        },
        // texte - Intitulé cadre analytique
        {
            name: "intutile_ca",
            label: "Intitulé",
            type: "text",
            placeholder: "Intitulé du cadre analytique",
            required: true,
            gridCols: 2,
        },
        // texte - Abrégé
        {
            name: "abgrege_ca",
            label: "Abrégé",
            type: "text",
            placeholder: "Ex: CA, AXE, SOUS-AXE...",
            required: true,
            gridCols: 1,
        },
        // number/select - Niveau (peut être number ou string)
        {
            name: "niveau_ca",
            label: "Niveau",
            type: "text", // ou "number" selon le besoin
            placeholder: "Ex: 1, 2, 3 ou 'A', 'B', 'C'...",
            required: true,
            gridCols: 1,
        },
        // number - Coût axe
        {
            name: "cout_axe",
            label: "Coût axe",
            type: "number",
            placeholder: "Montant du coût",
            required: true,
            min: 0,
            step: 0.01,
            gridCols: 1,
        },
        // select - Partenaire (optionnel)
        {
            name: "partenaire_ca",
            label: "Partenaire",
            type: "select",
            placeholder: "Sélectionner un partenaire (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Parent cadre analytique (optionnel)
        {
            name: "parent_ca",
            label: "Parent",
            type: "select",
            placeholder: "Sélectionner un parent (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Programme (optionnel)
        {
            name: "programme_ca",
            label: "Programme",
            type: "select",
            placeholder: "Sélectionner un programme (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
    ]

})