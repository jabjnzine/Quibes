export function getApiErrors(error: unknown): Record<string, string> | null {
  const data = (error as { response?: { data?: { errors?: Record<string, string> } } })?.response?.data
  if (data?.errors && typeof data.errors === 'object') return data.errors
  return null
}

export function getApiMessage(error: unknown): string {
  return (
    (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
    'เกิดข้อผิดพลาด กรุณาลองใหม่'
  )
}
