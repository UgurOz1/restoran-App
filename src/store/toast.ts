/*
  toast store: Basit bildirim kuyruğu
  - show(message, variant, timeoutMs): toast ekler ve süre sonunda otomatik kaldırır
  - remove(id): manuel kaldırma
*/
import { create } from 'zustand'

export type ToastVariant = 'success' | 'info' | 'error'
export type Toast = { id: string; message: string; variant: ToastVariant }

type ToastState = {
  toasts: Toast[]
  show: (message: string, variant?: ToastVariant, timeoutMs?: number) => void
  remove: (id: string) => void
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  show: (message, variant = 'success', timeoutMs = 2000) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const toast = { id, message, variant }
    set({ toasts: [...get().toasts, toast] })
    setTimeout(() => get().remove(id), timeoutMs)
  },
  remove: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}))
