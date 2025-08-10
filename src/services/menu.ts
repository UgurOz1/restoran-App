import type { MenuItem } from '../types'

/**
 * public/menu.json dosyasından menü verisini getirir.
 * Vite'ın public klasörü kökünden `/menu.json` ile servis edilir.
 */
export async function fetchMenu(): Promise<MenuItem[]> {
  const res = await fetch('/menu.json', { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Menü alınamadı')
  }
  const data = (await res.json()) as MenuItem[]
  return data
}
