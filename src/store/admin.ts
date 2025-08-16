import { create } from 'zustand'

type AdminState = {
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
}

const ADMIN_KEY = 'restaurant-admin-auth'
const ADMIN_PASSWORD = 'admin123' // basit demo; prod'da asla böyle yapmayın

function readAuth(): boolean {
  try { return localStorage.getItem(ADMIN_KEY) === '1' } catch { return false }
}
function writeAuth(val: boolean) {
  localStorage.setItem(ADMIN_KEY, val ? '1' : '0')
}

export const useAdminStore = create<AdminState>((set) => ({
  isAuthenticated: readAuth(),
  login: (password) => {
    const ok = password === ADMIN_PASSWORD
    if (ok) set({ isAuthenticated: true }), writeAuth(true)
    return ok
  },
  logout: () => { writeAuth(false); set({ isAuthenticated: false }) }
}))


