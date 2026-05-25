import { useEffect, useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'
import { DynamicForm } from '@/Global/Forms/DynamicForm'
import {
  getProjetFormConfigForCreateStep1,
  getProjetFormConfigForCreateStep2,
} from '@/simadou/allfieldsConfig/projetForm'
import {
  PROJET_CREATE_STEP1,
  PROJET_CREATE_STEP2,
} from '@/simadou/allResetFields/resetField'
import {
  useCreateProjet,
  useGetActeurs,
  useGetLocalites,
} from '@/simadou/allHooks/admin/projetHooks'
import { useActiveProgrammeId } from '@/hooks/use-active-project'
import {
  projectCreateStep1Schema,
  projectCreateStep2Schema,
  type ProjectCreateStep1Data,
  type ProjectCreateStep2Data,
  type ProjectCreateSubmitData,
} from '@/simadou/schemas/projetSchema'

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
      <div className='relative mb-2 flex items-center justify-between'>
        <div className='absolute left-0 top-1/2 -z-10 h-0.5 w-full bg-border' />
        {[1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
              step >= i
                ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                : 'border-muted-foreground/30 bg-background text-muted-foreground'
            )}
          >
            {step > i ? <Check className='h-5 w-5' /> : i}
          </div>
        ))}
      </div>
      <div className='flex justify-between text-sm text-muted-foreground'>
        <span>Informations générales</span>
        <span>Acteurs et zones</span>
      </div>

      {step === 1 && (
        <DynamicForm
          key={`projet-step1-${idProgramme ?? 'none'}`}
          config={step1Config}
          schema={projectCreateStep1Schema}
          defaultValues={step1Data ?? PROJET_CREATE_STEP1}
          onSubmit={handleStep1Submit}
          submitText='Suivant'
          loadingText='Validation…'
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
        />
      )}

      <div className='relative z-10 flex justify-between border-t pt-4'>
        {step > 1 ? (
          <Button type='button' variant='outline' onClick={() => setStep(1)}>
            Précédent
          </Button>
        ) : (
          <div />
        )}
        <DialogClose asChild>
          <Button type='button' variant='outline' onClick={handleCancel}>
            Annuler
          </Button>
        </DialogClose>
      </div>
    </div>
  )
}
