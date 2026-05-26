import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DynamicForm } from '@/Global/Forms/DynamicForm'
import { FormStepIndicator } from '@/Global/Forms/FormStepIndicator'
import {
  getProjetFormConfigForCreateStep1,
  getProjetFormConfigForCreateStep2,
} from '@/simadou/allfieldsConfig/projetForm'
import {
  PROJET_CREATE_STEP1,
  PROJET_CREATE_STEP2,
} from '@/simadou/allResetFields/resetField'
import { useCreateProjet } from '@/simadou/allHooks/admin/projetHooks'
import {
  useGetActeurs,
  useGetLocalites,
} from '@/simadou/allHooks/admin/sharedHooks'
import { useActiveProgrammeId } from '@/hooks/use-active-programme'
import {
  projectCreateStep1Schema,
  projectCreateStep2Schema,
  type ProjectCreateStep1Data,
  type ProjectCreateStep2Data,
  type ProjectCreateSubmitData,
} from '@/simadou/schemas/projetSchema'

const PROJET_STEPS = [
  {
    title: 'Informations générales',
    description: 'Identité et paramètres du projet',
  },
  {
    title: 'Acteurs et zones',
    description: 'Partenaires, signataires et périmètre géographique',
  },
] as const

type ProjetFormProps = {
  open: boolean
  onSuccess: () => void
  onClose: () => void
}

export default function ProjetForm({ open, onSuccess, onClose }: ProjetFormProps) {
  const idProgramme = useActiveProgrammeId()
  const [step, setStep] = useState(1)
  const [step1Data, setStep1Data] = useState<ProjectCreateStep1Data | null>(
    null
  )
  const [step2Data, setStep2Data] =
    useState<ProjectCreateStep2Data>(PROJET_CREATE_STEP2)

  const { data: acteurs = [] } = useGetActeurs()
  const { data: localites = [] } = useGetLocalites()
  const createMutation = useCreateProjet(idProgramme)

  const step1Config = useMemo(() => getProjetFormConfigForCreateStep1(), [])
  const step2Config = useMemo(
    () => getProjetFormConfigForCreateStep2(acteurs, localites),
    [acteurs, localites]
  )

  const resetForm = () => {
    setStep(1)
    setStep1Data(null)
    setStep2Data(PROJET_CREATE_STEP2)
  }

  useEffect(() => {
    if (!open) resetForm()
  }, [open])

  const handleCancel = () => {
    onClose()
  }

  const handleStep1Submit = (data: ProjectCreateStep1Data) => {
    setStep1Data(data)
    setStep(2)
  }

  const handleStep2Submit = (data: ProjectCreateStep2Data) => {
    if (idProgramme == null) {
      toast.error('Sélectionnez un programme avant de créer un projet.')
      return
    }
    if (!step1Data) {
      toast.error('Complétez les informations générales.')
      setStep(1)
      return
    }

    const payload: ProjectCreateSubmitData = {
      ...step1Data,
      ...data,
      structure_projet: [data.structure_projet],
      signataires_projet: data.signataires_projet.map(Number),
      partenaires_execution_projet: data.partenaires_execution_projet.map(
        Number
      ),
      zone_projet: data.zone_projet.map(Number),
    }

    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Projet créé')
        resetForm()
        onSuccess()
      },
      onError: () => toast.error("Erreur lors de l'enregistrement du projet"),
    })
  }

  return (
    <div className='space-y-6'>
      <FormStepIndicator
        steps={[...PROJET_STEPS]}
        currentStep={step}
      />

      {step === 1 && (
        <DynamicForm
          key={`projet-step1-${idProgramme ?? 'none'}`}
          config={step1Config}
          schema={projectCreateStep1Schema}
          defaultValues={step1Data ?? PROJET_CREATE_STEP1}
          onSubmit={handleStep1Submit}
          submitText='Suivant'
          loadingText='Validation…'
          onCancel={handleCancel}
          cancelText='Annuler'
        />
      )}

      {step === 2 && (
        <DynamicForm
          key='projet-step2'
          config={step2Config}
          schema={projectCreateStep2Schema}
          defaultValues={step2Data}
          onSubmit={handleStep2Submit}
          submitText='Créer le projet'
          loadingText='Enregistrement…'
          isLoading={createMutation.isPending}
          onFieldChange={(name, value) => {
            setStep2Data((prev) => ({ ...prev, [name]: value }))
          }}
          onBack={() => setStep(1)}
          onCancel={handleCancel}
          cancelText='Annuler'
        />
      )}
    </div>
  )
}
