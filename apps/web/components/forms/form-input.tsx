'use client'

import { useFormContext } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface FormInputProps {
  name: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
  className?: string
  disabled?: boolean
}

export function FormInput({
  name,
  label,
  type = 'text',
  placeholder,
  required,
  className,
  disabled,
}: FormInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const error = errors[name]?.message as string | undefined

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={name}>
        {label} {required && <span className="text-danger">*</span>}
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...register(name)}
        className={cn(error && 'border-danger focus-visible:ring-danger/30')}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
