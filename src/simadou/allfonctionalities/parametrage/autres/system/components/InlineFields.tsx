import { useState, useRef, useEffect } from 'react'
import { Check, X, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { usePatchConfigField } from '@/simadou/allHooks/configurations/configurationHooks'
import type { ConfigFieldKey, ConfigFieldValue } from '@/simadou/schemas/configurations.schema'

interface InlineFieldProps {
  configId:    number
  field:       ConfigFieldKey
  value:       ConfigFieldValue
  label:       string
  type?:       'text' | 'email' | 'number' | 'url' | 'tel' | 'password' | 'switch'
  placeholder?: string
  helperText?:  string
  min?:         number
  readOnly?:    boolean
}

export function InlineField({
  configId,
  field,
  value,
  label,
  type = 'text',
  placeholder,
  helperText,
  min,
  readOnly = false,
}: InlineFieldProps) {
  const [isEditing,   setIsEditing]   = useState(false)
  const [draftValue,  setDraftValue]  = useState<ConfigFieldValue>(value)
  const inputRef = useRef<HTMLInputElement>(null)

  const { mutate: patchField, isPending } = usePatchConfigField(configId)

  // Sync draftValue when value prop changes (e.g. after invalidation)
  useEffect(() => {
    if (!isEditing) setDraftValue(value)
  }, [value, isEditing])

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  const handleConfirm = () => {
    if (draftValue === value) {
      setIsEditing(false)
      return
    }
    patchField(
      { field, value: draftValue },
      {
        onSuccess: () => setIsEditing(false),
        onError:   () => {
          setDraftValue(value)  // revert
          setIsEditing(false)
        },
      }
    )
  }

  const handleCancel = () => {
    setDraftValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter')  handleConfirm()
    if (e.key === 'Escape') handleCancel()
  }

  // ── Switch field ──────────────────────────────────────────────────────────
  if (type === 'switch') {
    return (
      <div className="flex items-center justify-between rounded-lg border border-border p-3.5">
        <div>
          <p className="text-sm font-medium">{label}</p>
          {helperText && (
            <p className="text-xs text-muted-foreground">{helperText}</p>
          )}
        </div>
        <Switch
          checked={!!value}
          disabled={readOnly || isPending}
          onCheckedChange={(checked) =>
            patchField({ field, value: checked })
          }
        />
      </div>
    )
  }

  // ── Text / number / email / url / tel / password ──────────────────────────
  return (
    <div className="group flex flex-col gap-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>

      {isEditing ? (
        <div className="flex items-center gap-1.5">
          <Input
            ref={inputRef}
            type={type}
            value={String(draftValue ?? '')}
            placeholder={placeholder}
            min={min}
            disabled={isPending}
            onChange={e =>
              setDraftValue(
                type === 'number' ? e.target.valueAsNumber : e.target.value
              )
            }
            onKeyDown={handleKeyDown}
            className="h-8 text-sm"
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-8 text-emerald-600 hover:text-emerald-700"
            disabled={isPending}
            onClick={handleConfirm}
          >
            <Check className="size-3.5" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-8 text-muted-foreground"
            disabled={isPending}
            onClick={handleCancel}
          >
            <X className="size-3.5" />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            'flex items-center justify-between rounded-md px-2 py-1.5',
            'border border-transparent transition-colors',
            !readOnly && 'hover:border-border hover:bg-muted/50 cursor-pointer'
          )}
          onClick={() => !readOnly && setIsEditing(true)}
        >
          <span className={cn(
            'text-sm',
            !value && 'text-muted-foreground italic'
          )}>
            {type === 'password'
              ? '••••••••'
              : (value ?? placeholder ?? '—')
            }
          </span>
          {!readOnly && (
            <Pencil className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          )}
        </div>
      )}

      {helperText  && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  )
}