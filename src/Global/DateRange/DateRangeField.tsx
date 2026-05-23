import { useController, type Control } from "react-hook-form";
import { cn } from "@/lib/utils";
import type { FieldConfig } from "../allTypes/formConfig";

interface DateRangeFieldProps {
  field: FieldConfig;
  control: Control<any>;
  errors: any;
}

export const DateRangeField = ({ field, control, errors }: DateRangeFieldProps) => {
  const startName = field.startName ?? "dateDebut";
  const endName = field.endName ?? "dateFin";

  const { field: startField } = useController({ name: startName, control });
  const { field: endField } = useController({ name: endName, control });

  const startError = errors[startName]?.message as string | undefined;
  const endError = errors[endName]?.message as string | undefined;

  const toInputValue = (val: unknown): string => {
    if (!val) return "";
    if (val instanceof Date) return val.toISOString().split("T")[0];
    return String(val);
  };

  const handleChange = (controllerField: typeof startField, value: string) => {
    controllerField.onChange(value ? new Date(value) : undefined);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium block">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </label>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Début</span>
          <input
            type="date"
            value={toInputValue(startField.value)}
            onChange={(e) => handleChange(startField, e.target.value)}
            onBlur={startField.onBlur}
            disabled={field.disabled}
            className={cn(
              "h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50",
              startError && "border-red-500 focus:ring-red-500",
            )}
          />
          {startError && (
            <p className="text-xs text-red-500">{startError}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Fin</span>
          <input
            type="date"
            value={toInputValue(endField.value)}
            onChange={(e) => handleChange(endField, e.target.value)}
            onBlur={endField.onBlur}
            disabled={field.disabled}
            min={toInputValue(startField.value)}
            className={cn(
              "h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50",
              endError && "border-red-500 focus:ring-red-500",
            )}
          />
          {endError && (
            <p className="text-xs text-red-500">{endError}</p>
          )}
        </div>
      </div>

      {field.helperText && (
        <p className="text-xs text-gray-500">{field.helperText}</p>
      )}
    </div>
  );
};