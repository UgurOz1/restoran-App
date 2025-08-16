/*
  App: Restoran menü sayfasının kabuğu.
  Sorumluluklar:
  - Menü verisini mock API'den (public/menu.json) asenkron almak
  - Kategori bazlı filtreleme (Tümü dahil)
  - Grid içinde kartları göstermek ve küçük yükleme/boş/hata durumlarını yönetmek
  - Global bileşenleri (Header, CategoryTabs, CartDrawer, Toaster, Background) kompoze etmek
  - Auto-animate ile grid geçişlerini yumuşatmak
*/
import { useEffect, useMemo, useRef, useState } from 'react'
import Header from './components/Header'
import CategoryTabs from './components/CategoryTabs'
import MenuCard from './components/MenuCard'
import CartDrawer from './components/CartDrawer'
import Toaster from './components/Toaster'
import Background from './components/Background'
import type { MenuItem } from './types'
import { loadMenu } from './services/menu'
import autoAnimate from '@formkit/auto-animate'

/**
 * Kök uygulama bileşeni.
 * - İlk yüklemede menüyü getirir ve kategorileri çıkarır.
 * - Seçili kategoriye göre listeyi filtreler.
 */
function App() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<string>('Tümü')

  const gridRef = useRef<HTMLDivElement | null>(null)
  // Grid elemanları değişirken kartların akıcı yer değiştirmesi için
  useEffect(() => { if (gridRef.current) autoAnimate(gridRef.current) }, [])

  // Menü verisini getir (localStorage override varsa onu kullanır)
  useEffect(() => {
    ;(async () => {
      try {
        const data = await loadMenu()
        setItems(data)
      } catch (e: any) {
        setError(e?.message ?? 'Menü yüklenemedi')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map((i) => i.category)))
    return ['Tümü', ...cats]
  }, [items])

  const visible = useMemo(() => {
    return selected === 'Tümü' ? items : items.filter((i) => i.category === selected)
  }, [items, selected])

  return (
    <div className="min-h-screen flex flex-col">
      <Background />
      <Header />
      <CategoryTabs categories={categories} selected={selected} onSelect={setSelected} />

      <main className="container-responsive py-6">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-4 animate-pulse h-48" />
            ))}
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>

      <CartDrawer />
      <Toaster />
    </div>
  )
}

export default App
