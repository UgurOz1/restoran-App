/*
  CartDrawer: Sağdan açılan sepet çekmecesi
  - Zustand store'dan okunur/yazılır (inc/dec/remove/clear)
  - Auto‑animate ile satır geçişleri yumuşatılır
  - Erişilebilirlik: role="dialog", overlay tıklayınca kapanır
*/
import { useEffect, useRef, useState } from 'react'
import { XMarkIcon, PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useCartStore, selectTotal } from '../store/cart'
import { formatTRY } from '../utils/format'
import SuccessModal from './SuccessModal'
import autoAnimate from '@formkit/auto-animate'

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen)
  const close = useCartStore((s) => s.close)
  const itemsRecord = useCartStore((s) => s.items)
  const inc = useCartStore((s) => s.inc)
  const dec = useCartStore((s) => s.dec)
  const remove = useCartStore((s) => s.remove)
  const clear = useCartStore((s) => s.clear)
  const total = useCartStore(selectTotal)
  const [successOpen, setSuccessOpen] = useState(false)

  const items = Object.values(itemsRecord)

  const listRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (listRef.current) autoAnimate(listRef.current)
  }, [])

  const onComplete = () => setSuccessOpen(true)
  const onCloseSuccess = () => { setSuccessOpen(false); clear(); close() }

  return (
    <>
      <div className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-slate-900/40 transition-opacity ${isOpen ? 'opacity-100 animate-in fade-in duration-200' : 'opacity-0 animate-out fade-out duration-150'}`}
          onClick={close}
        />
        <aside
          className={`absolute right-0 top-0 h-full w-[420px] max-w-[92%] bg-white/80 backdrop-blur-xl shadow-2xl will-change-transform transition-transform duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right data-[state=open]:translate-x-0 data-[state=closed]:translate-x-full`}
          data-state={isOpen ? 'open' : 'closed'}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200/60">
            <h2 className="text-base font-semibold">Sepet</h2>
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100" onClick={close} aria-label="Kapat">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div ref={listRef} className="p-4 h-[calc(100%-8rem)] overflow-y-auto space-y-3">
            {items.length === 0 ? (
              <div className="h-full grid place-items-center text-sm text-slate-500">Sepetiniz boş.</div>
            ) : (
              items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/70 p-3">
                  {product.image && (
                    <img src={product.image} alt={product.name} className="h-14 w-14 rounded-lg object-cover" />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-slate-900 truncate">{product.name}</h3>
                    <p className="text-xs text-slate-500">{formatTRY(product.price)} x {quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100" onClick={() => dec(product.id)} aria-label="Azalt">
                      <MinusIcon className="h-5 w-5" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                    <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100" onClick={() => inc(product.id)} aria-label="Arttır">
                      <PlusIcon className="h-5 w-5" />
                    </button>
                    <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-red-50 text-red-600" onClick={() => remove(product.id)} aria-label="Kaldır">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="sticky bottom-0 border-t border-slate-200/60 p-4 bg-white/80 backdrop-blur-xl">
            <div className="flex items-center justify-between text-sm mb-3">
              <span>Ara Toplam</span>
              <span className="font-semibold">{formatTRY(total)}</span>
            </div>
            <button className="w-full btn btn-accent h-11 text-base" onClick={onComplete} disabled={items.length === 0}>
              Sepeti Tamamla
            </button>
          </div>
        </aside>
      </div>

      <SuccessModal open={successOpen} onClose={onCloseSuccess} />
    </>
  )
}
