import type { FormConfig } from '@/Global/types/formConfig'
import { CONVENTION_STATES } from '@/simadou/schemas/conventionSchema'

export const getConventionFormConfig = (): FormConfig => ({
  fields: [
    {
      name: 'code_convention',
      label: 'Code convention',
      type: 'text',
      placeholder: 'Ex: CONV-2024-001',
      required: true,
      gridCols: 2,
    },
    {
      name: 'reference_conv',
      label: 'Référence',
      type: 'text',
      placeholder: 'Référence de la convention',
      required: true,
      gridCols: 2,
    },
    {
      name: 'intutile_conv',
      label: 'Intitulé',
      type: 'textarea',
      placeholder: 'Intitulé de la convention',
      required: true,
      gridCols: 1,
    },
    {
      name: 'montant_conv',
      label: 'Montant ($)',
      type: 'number',
      placeholder: 'Montant en dollars',
      required: true,
      gridCols: 2,
    },
    {
      name: 'date_signature_conv',
      label: 'Date de signature',
      type: 'date',
      required: true,
      gridCols: 2,
    },
    {
      name: 'etat_conv',
      label: 'État',
      type: 'select',
      placeholder: 'Sélectionner un état',
      required: true,
      options: CONVENTION_STATES.map((state) => ({
        value: state.value,
        label: state.label,
      })),
      gridCols: 2,
    },
    {
      name: 'partenaire_conv',
      label: 'Partenaire',
      type: 'select',
      placeholder: 'Sélectionner un partenaire',
      required: false,
      options: [],
      gridCols: 2,
    },
  ],
})
