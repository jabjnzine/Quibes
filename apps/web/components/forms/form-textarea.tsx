'use client'

import { useFormContext } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface FormTextareaProps {
  name: string
  label: string
  placeholder?: string
  required?: boolean
  rows?: number
  className?: string
}

export function FormTextarea({
  name,
  label,
  placeholder,
  required,
  rows = 3,
  className,
}: FormTextareaProps) {
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
      <Textarea
        id={name}
        placeholder={placeholder}
        rows={rows}
        {...register(name)}
        className={cn('resize-none', error && 'border-danger focus-visible:ring-danger/30')}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
