'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import { FormInput } from '@/components/forms/form-input'
import { useLogin } from '@/hooks/use-auth'
import { showToast } from '@/lib/toast'
import { getApiErrors, getApiMessage } from '@/lib/errors'

const schema = z.object({
  email: z.string().min(1, 'กรุณากรอกอีเมล').email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: z.string().min(1, 'กรุณากรอกรหัสผ่าน'),
})

type FormValues = z.infer<typeof schema>

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('from') ?? '/dashboard'

  const login = useLogin()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      await login.mutateAsync(data)
      showToast('เข้าสู่ระบบสำเร็จ', 'success')
      router.push(redirectTo)
      router.refresh()
    } catch (error) {
      const fieldErrors = getApiErrors(error)
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, message]) => {
          form.setError(field as keyof FormValues, { message: String(message) })
        })
        showToast('กรุณาตรวจสอบข้อมูลให้ถูกต้อง', 'warning')
      } else {
        showToast(getApiMessage(error), 'error')
      }
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <FormInput
          name="email"
          label="อีเมล"
          type="email"
          placeholder="staff@quibes.clinic"
          required
        />

        <FormInput
          name="password"
          label="รหัสผ่าน"
          type="password"
          placeholder="••••••••"
          required
        />

        <button
          type="submit"
          disabled={login.isPending}
          className="mt-2 flex items-center justify-center gap-2 h-10 rounded-lg bg-copper text-white text-sm font-medium hover:bg-espresso disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {login.isPending && <Loader2 size={16} className="animate-spin" />}
          {login.isPending ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>
    </FormProvider>
  )
}
