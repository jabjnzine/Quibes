import { useState } from 'react'

interface UsePaginationOptions {
  defaultLimit?: number
}

export function usePagination({ defaultLimit = 20 }: UsePaginationOptions = {}) {
  const [page, setPage] = useState(1)
  const [limit] = useState(defaultLimit)

  const goToPage = (p: number) => setPage(p)
  const nextPage = () => setPage((p) => p + 1)
  const prevPage = () => setPage((p) => Math.max(1, p - 1))
  const reset = () => setPage(1)

  return { page, limit, goToPage, nextPage, prevPage, reset }
}
