import { create } from 'zustand'

interface CartItem {
  type: 'service' | 'product' | 'course'
  referenceId: string
  name: string
  quantity: number
  unitPrice: number
  discount: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  updateQty: (referenceId: string, qty: number) => void
  removeItem: (referenceId: string) => void
  clearCart: () => void
  total: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => set((s) => ({ items: [...s.items, item] })),
  updateQty: (id, qty) =>
    set((s) => ({
      items: s.items.map((i) => (i.referenceId === id ? { ...i, quantity: qty } : i)),
    })),
  removeItem: (id) =>
    set((s) => ({ items: s.items.filter((i) => i.referenceId !== id) })),
  clearCart: () => set({ items: [] }),
  total: () =>
    get().items.reduce(
      (sum, i) => sum + i.unitPrice * i.quantity - i.discount,
      0,
    ),
}))
