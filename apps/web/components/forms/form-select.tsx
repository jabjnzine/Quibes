'use client'

import { useFormContext, Controller } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface SelectOption {
  label: string
  value: string
}

interface FormSelectProps {
  name: string
  label: string
  options: SelectOption[]
  placeholder?: string
  required?: boolean
  className?: string
  disabled?: boolean
}

export function FormSelect({
  name,
  label,
  options,
  placeholder,
  required,
  className,
  disabled,
}: FormSelectProps) {
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
          <Select
            value={field.value ?? ''}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger
              id={name}
              className={cn(error && 'border-danger focus:ring-danger/30')}
            >
              <SelectValue placeholder={placeholder ?? `เลือก${label}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
