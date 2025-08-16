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

// Admin tarafından yapılan değişiklikleri saklamak için localStorage anahtarı
const STORAGE_KEY = 'restaurant-menu-override'

function readOverride(): MenuItem[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as MenuItem[]
    if (!Array.isArray(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

function writeOverride(items: MenuItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

/**
 * Menü verisini getirir. LocalStorage override varsa onu, yoksa public/menu.json'u döner.
 */
export async function loadMenu(): Promise<MenuItem[]> {
  const override = readOverride()
  if (override) return override
  return await fetchMenu()
}

/**
 * Tüm menüyü kaydeder (override eder).
 */
export function saveMenu(items: MenuItem[]): void {
  writeOverride(items)
}

/** Ürünü id eşleşmesine göre ekler/günceller ve güncel listeyi döner. */
export async function upsertMenuItem(item: MenuItem): Promise<MenuItem[]> {
  const items = await loadMenu()
  const idx = items.findIndex((i) => i.id === item.id)
  let next: MenuItem[]
  if (idx >= 0) {
    next = [...items]
    next[idx] = item
  } else {
    next = [...items, item]
  }
  writeOverride(next)
  return next
}

/** Ürünü siler ve güncel listeyi döner. */
export async function deleteMenuItem(id: string): Promise<MenuItem[]> {
  const items = await loadMenu()
  const next = items.filter((i) => i.id !== id)
  writeOverride(next)
  return next
}

/** Admin override'ı kaldırır (public/menu.json'a geri döner). */
export function resetMenuOverride(): void {
  localStorage.removeItem(STORAGE_KEY)
}