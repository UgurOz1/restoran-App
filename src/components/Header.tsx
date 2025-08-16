/*
  Header: Sayfa üst çubuğu
  - Sol: Sepet ikon butonu (badge ile toplam adet)
  - Orta: Başlık
*/
import { ShoppingCartIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { navigate } from '../utils/router'
import { useCartStore, selectCount } from '../store/cart'

export default function Header() {
  const count = useCartStore(selectCount)
  const toggle = useCartStore((s) => s.toggle)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
      <div className="container-responsive flex items-center justify-between h-16">
        <button
          aria-label="Sepet"
          onClick={toggle}
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/80 shadow-sm hover:shadow transition"
        >
          <ShoppingCartIcon className="h-5 w-5 text-slate-700" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 rounded-full bg-accent text-xs text-white grid place-items-center px-1">
              {count}
            </span>
          )}
        </button>
        <h1 className="text-lg font-semibold tracking-tight">Menü</h1>
        <button onClick={() => navigate('/admin')} className="inline-flex h-10 px-3 items-center gap-2 rounded-xl border border-slate-200 bg-white/80 shadow-sm hover:shadow transition text-sm">
          <LockClosedIcon className="h-4 w-4" />
          Admin
        </button>
      </div>
    </header>
  )
}
