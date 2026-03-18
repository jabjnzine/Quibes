import { create } from 'zustand'
import type { OpdItem } from '@quibes/shared'

interface OpdState {
  visitId: string | null
  patientId: string | null
  items: OpdItem[]
  setVisit: (visitId: string, patientId: string) => void
  addItem: (item: OpdItem) => void
  removeItem: (itemId: string) => void
  clearVisit: () => void
}

export const useOpdStore = create<OpdState>((set) => ({
  visitId: null,
  patientId: null,
  items: [],
  setVisit: (visitId, patientId) => set({ visitId, patientId }),
  addItem: (item) => set((s) => ({ items: [...s.items, item] })),
  removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  clearVisit: () => set({ visitId: null, patientId: null, items: [] }),
}))
