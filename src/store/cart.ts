/*
  cart store: Sepet durum yönetimi (Zustand + persist)
  - items: ürün id → { product, quantity }
  - isOpen: sepet çekmecesinin açık/kapalı durumu
  - persist: localStorage ('restaurant-cart') ile sadece items alanını kalıcı kılar
  Neden Record? O(1) erişim ve sade arttır/azalt işlemleri için.
*/
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { MenuItem } from '../types'

export type CartState = {
    items: Record<string, { product: MenuItem; quantity: number }>
    isOpen: boolean
    open: () => void
    close: () => void
    toggle: () => void
    add: (product: MenuItem) => void
    inc: (productId: string) => void
    dec: (productId: string) => void
    remove: (productId: string) => void
    clear: () => void
  }
  export const useCartStore = create<CartState>()(
    persist(
      (set, get) => ({
        items: {},
        isOpen: false,
        open: () => set({ isOpen: true }),
        close: () => set({ isOpen: false }),
        toggle: () => set({ isOpen: !get().isOpen }),
        add: (product) => {
          const current = get().items
          const existing = current[product.id]
          const quantity = existing ? existing.quantity + 1 : 1
          set({ items: { ...current, [product.id]: { product, quantity } } })
        },
        inc: (id) => {
          const current = get().items
          const entry = current[id]
          if (!entry) return
          set({ items: { ...current, [id]: { ...entry, quantity: entry.quantity + 1 } } })
        },
        dec: (id) => {
          const current = get().items
          const entry = current[id]
          if (!entry) return
          if (entry.quantity <= 1) {
            const { [id]: _, ...rest } = current
            set({ items: rest })
          } else {
            set({ items: { ...current, [id]: { ...entry, quantity: entry.quantity - 1 } } })
          }
        },
        remove: (id) => {
          const current = get().items
          const { [id]: _, ...rest } = current
          set({ items: rest })
        },
        clear: () => set({ items: {} })
      }),
      {
        name: 'restaurant-cart',
        partialize: (state) => ({ items: state.items }),
        storage: createJSONStorage(() => localStorage)
      }
    )
  )  
/** Toplam ürün adedi */
export const selectCount = (s: CartState) =>
    Object.values(s.items).reduce((sum, it) => sum + it.quantity, 0)
  
  /** Sepet tutarı */
export const selectTotal = (s: CartState) =>
    Object.values(s.items).reduce((sum, it) => sum + it.product.price * it.quantity, 0)