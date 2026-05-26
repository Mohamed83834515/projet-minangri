import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export type FormStepItem = {
  title: string
  description?: string
}

type FormStepIndicatorProps = {
  steps: FormStepItem[]
  currentStep: number
  className?: string
}

/**
 * Indicateur visuel d'étapes (aligné sur StepDynamicForm / PTBA).
 * Affichage uniquement — pas de navigation.
 */
export function FormStepIndicator({
  steps,
  currentStep,
  className,
}: FormStepIndicatorProps) {
  const totalSteps = steps.length
  const progress =
    totalSteps <= 1 ? 100 : ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className={cn('space-y-4', className)}>
      <div className='h-1.5 w-full overflow-hidden rounded-full bg-muted'>
        <div
          className='h-full rounded-full bg-primary transition-all duration-500 ease-out'
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className='flex items-center'>
        {steps.map((step, i) => {
          const stepNumber = i + 1
          const isDone = currentStep > stepNumber
          const isActive = currentStep === stepNumber

          return (
            <div
              key={step.title}
              className='flex min-w-0 flex-1 items-center last:flex-none'
            >
              <div
                className={cn(
                  'relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300',
                  isDone &&
                    'border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/30',
                  isActive &&
                    'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/40 ring-4 ring-primary/20',
                  !isDone &&
                    !isActive &&
                    'border-border bg-muted text-muted-foreground/60'
                )}
              >
                {isDone ? <Check className='h-4 w-4 stroke-[2.5]' /> : stepNumber}
                {isActive && (
                  <span className='absolute inset-0 animate-ping rounded-full bg-primary/20' />
                )}
              </div>

              <span
                className={cn(
                  'ml-2 hidden max-w-[120px] truncate text-xs font-medium sm:block',
                  isDone && 'text-emerald-600',
                  isActive && 'font-semibold text-primary',
                  !isDone && !isActive && 'text-muted-foreground/50'
                )}
              >
                {step.title}
              </span>

              {i < steps.length - 1 && (
                <div className='mx-2 h-0.5 flex-1 overflow-hidden rounded-full bg-border/40'>
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      isDone ? 'w-full bg-emerald-400' : 'w-0'
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {steps[currentStep - 1] && (
        <div className='animate-in duration-300 fade-in-0 slide-in-from-left-2'>
          <div className='flex items-center gap-2'>
            <span className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary'>
              {currentStep}
            </span>
            <h3 className='text-sm font-semibold leading-tight text-foreground'>
              {steps[currentStep - 1].title}
            </h3>
          </div>
          {steps[currentStep - 1].description && (
            <p className='mt-1 ml-7 text-xs text-muted-foreground'>
              {steps[currentStep - 1].description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
