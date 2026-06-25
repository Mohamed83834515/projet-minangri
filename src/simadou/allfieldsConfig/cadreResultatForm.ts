import type { FormConfig, SelectOption } from '../../Global/types/formConfig'

export const getCadreResultatFormConfigForDialog = ({
  parentLabel,
  parentOptions,
  acteurOptions,
  isLoadingActeurs,
  showParent,
  codeLength,
}: {
  parentLabel: string
  parentOptions: SelectOption[]
  acteurOptions: SelectOption[]
  isLoadingActeurs?: boolean
  showProjet?: boolean
  showParent: boolean
  codeLength: number
}): FormConfig => ({
  fields: [
    {
      name: 'code_cr',
      label: `Code du cadre (exactement ${codeLength} caractères)`,
      type: 'text',
      placeholder: `Code de ${codeLength} caractères`,
      required: true,
      maxLength: codeLength,
      gridCols: 2,
    },
    {
      name: 'cout_axe',
      label: "Coût de l'axe",
      type: 'number',
      placeholder: 'Entrez le coût',
      required: true,
      min: 0,
      step: 1,
      gridCols: 2,
    },
    {
      name: 'intutile_cr',
      label: 'Intitulé du cadre',
      type: 'text',
      placeholder: 'Intitulé complet du cadre de résultat',
      required: true,
      maxLength: 200,
      gridCols: 1,
    },
    {
      name: 'abgrege_cr',
      label: 'Abrégé',
      type: 'text',
      placeholder: 'Abrégé du cadre',
      required: true,
      maxLength: 50,
      gridCols: 2,
    },
    ...(showParent
      ? [
          {
            name: 'parent_cr',
            label: parentLabel || 'Parent',
            type: 'select' as const,
            placeholder: `Sélectionnez un ${parentLabel}`,
            required: false,
            options: parentOptions,
            gridCols: 2 as const,
          },
        ]
      : []),
    {
      name: 'partenaire_cr',
      label: 'Partenaire',
      type: 'select',
      placeholder: 'Sélectionnez un partenaire',
      required: false,
      options: acteurOptions,
      isLoading: isLoadingActeurs,
      gridCols: 2,
    },
  ],
})
