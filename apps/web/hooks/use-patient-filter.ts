import { useState } from 'react'
import { Gender } from '@quibes/shared'

export function usePatientFilter() {
  const [search, setSearch] = useState('')
  const [gender, setGender] = useState<Gender | ''>('')

  const reset = () => {
    setSearch('')
    setGender('')
  }

  return { search, setSearch, gender, setGender, reset }
}
