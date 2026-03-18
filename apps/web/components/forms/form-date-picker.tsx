'use client'

import { useFormContext, Controller } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface FormDatePickerProps {
  name: string
  label: string
  required?: boolean
  maxDate?: string
  minDate?: string
  helperText?: string
  className?: string
  disabled?: boolean
}

export function FormDatePicker({
  name,
  label,
  required,
  maxDate,
  minDate,
  helperText,
  className,
  disabled,
}: FormDatePickerProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const error = errors[name]?.message as string | undefined

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={name}>
        {label} {required && <span className="text-danger">*</span>}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            id={name}
            type="date"
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            max={maxDate}
            min={minDate}
            disabled={disabled}
            className={cn(error && 'border-danger focus-visible:ring-danger/30')}
          />
        )}
      />
      {helperText && !error && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
