import { useEffect, useImperativeHandle, forwardRef } from 'react'
import type { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Send, AlertCircle, PenLine, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { FormField } from '../Fields/FormField'
import type { FormConfig } from '../types/formConfig'
import { CHART_COLORS, useColor } from '@/stores/others/color-store'

// ─── Types ────────────────────────────────────────────────────────────────────

interface DynamicFormProps {
  config: FormConfig
  schema: z.ZodType<any, any>
  defaultValues: any
  onSubmit: (data: any) => void
  isLoading?: boolean
  submitText?: string
  loadingText?: string
  onFieldChange?: (fieldName: string, value: unknown) => void
}

export interface DynamicFormHandle {
  setValue: (name: string, value: any) => void
}

// ─── Composant ────────────────────────────────────────────────────────────────

export const DynamicForm = forwardRef<DynamicFormHandle, DynamicFormProps>(
  (
    {
      config,
      schema,
      defaultValues,
      onSubmit,
      isLoading = false,
      submitText = 'Soumettre',
      loadingText = 'En cours…',
      onFieldChange,
    },
    ref
  ) => {
    const { color } = useColor()
    const { stroke } = CHART_COLORS[color]

    const form = useForm({
      resolver: zodResolver(schema) as any,
      defaultValues: defaultValues as any,
      mode: 'onBlur' as const,
    })

    const {
      register,
      handleSubmit,
      formState: { errors, isDirty },
      control,
      watch,
      trigger,
      setValue,
      reset
    } = form

    useEffect(() => {
  reset(defaultValues);
}, [defaultValues]);

    useImperativeHandle(ref, () => ({
      setValue: (name: string, value: any) =>
        setValue(name as any, value, {
          shouldDirty: true,
          shouldValidate: false,
        }),
    }))

    useEffect(() => {
      if (!onFieldChange) return
      const sub = watch((data, { name }) => {
        if (name && data[name] !== undefined) onFieldChange(name, data[name])
      })
      return () => sub.unsubscribe()
    }, [watch, onFieldChange])

    const shouldShowField = (field: any) => {
      if (field.hidden) return false
      if (field.showWhen)
        return Object.entries(field.showWhen).every(([k, v]) => watch(k) === v)
      if (field.condition) return field.condition(watch())
      return true
    }

    const visibleFields = config.fields.filter(shouldShowField)
    const hasErrors = Object.keys(errors).length > 0
    const errorCount = Object.keys(errors).length

    // ── Status ────────────────────────────────────────────────────────────────

    const status = hasErrors
      ? {
          icon: <AlertCircle className='h-3.5 w-3.5' />,
          label: `${errorCount} erreur${errorCount > 1 ? 's' : ''} à corriger`,
          variant: 'destructive' as const,
          dot: 'bg-destructive',
        }
      : isDirty
        ? {
            icon: <PenLine className='h-3.5 w-3.5' />,
            label: 'Modifications en attente',
            variant: 'secondary' as const,
            dot: 'bg-amber-400',
          }
        : {
            icon: <CheckCircle2 className='h-3.5 w-3.5' />,
            label: 'Formulaire prêt',
            variant: 'outline' as const,
            dot: 'bg-emerald-400',
          }

    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-xl border bg-card shadow-sm',
          'transition-shadow duration-300 hover:shadow-md'
        )}
      >
        {/* ── Barre d'accentuation colorée en haut ── */}
        <div
          className='h-[3px] w-full'
          style={{
            background: `linear-gradient(to right, ${stroke}, ${stroke}55, transparent)`,
          }}
        />

        {/* ── Corps du formulaire ── */}
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit as any)}>
            <div className='p-6'>
              <div className='grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2'>
                {visibleFields.map((field, index) => (
                  <div
                    key={field.name}
                    className={cn(
                      'animate-in duration-300 fade-in-0 fill-mode-both slide-in-from-bottom-2',
                      field.gridCols === 1
                        ? 'col-span-1 sm:col-span-2'
                        : 'col-span-1'
                    )}
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <FormField
                      field={field}
                      register={register}
                      control={control}
                      errors={errors}
                      watch={watch}
                      trigger={trigger}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Pied du formulaire ── */}
            <div className='border-t bg-muted/30'>
              <div className='flex items-center justify-between gap-4 px-6 py-3'>
                {/* Indicateur de statut */}
                <div className='flex items-center gap-2'>
                  <span className='relative flex h-2 w-2'>
                    {(isDirty || hasErrors) && (
                      <span
                        className={cn(
                          'absolute inline-flex h-full w-full animate-ping rounded-full opacity-60',
                          status.dot
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        'relative inline-flex h-2 w-2 rounded-full',
                        status.dot
                      )}
                    />
                  </span>

                  <Badge
                    variant={status.variant}
                    className='gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium'
                  >
                    {status.icon}
                    {status.label}
                  </Badge>
                </div>

                {/* Bouton de soumission */}
                <Button
                  type='submit'
                  disabled={isLoading}
                  size='sm'
                  className={cn(
                    'group relative gap-2 px-5 font-medium tracking-wide',
                    'transition-all duration-200',
                    'disabled:cursor-not-allowed disabled:opacity-60'
                  )}
                  style={{
                    backgroundColor: stroke,
                    borderColor: stroke,
                    boxShadow: `0 1px 12px ${stroke}44`,
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className='h-3.5 w-3.5 animate-spin' />
                      <span>{loadingText}</span>
                    </>
                  ) : (
                    <>
                      <span>{submitText}</span>
                      <Send className='h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    )
  }
)

DynamicForm.displayName = 'DynamicForm'
