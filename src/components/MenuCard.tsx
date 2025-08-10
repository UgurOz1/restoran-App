/*
  MenuCard: Ürün kartı
  - Ürün görseli, ad, açıklama ve fiyat etiketi
  - "Sepete Ekle" ile cart store'da miktarı arttırır ve toast gösterir
*/
import type { MenuItem } from '../types'
import { formatTRY } from '../utils/format'
import { useCartStore } from '../store/cart'
import { useToastStore } from '../store/toast'

type Props = { item: MenuItem }

export default function MenuCard({ item }: Props) {
  const add = useCartStore((s) => s.add)
  const toast = useToastStore((s) => s.show)

  // Sepete ekle ve kullanıcıya kısa bir bildirim göster
  const onAdd = () => {
    add(item)
    toast(`${item.name} sepete eklendi`, 'success')
  }

  return (
    <div className="group overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 shadow-card transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
      {item.image && (
        <div className="relative h-40 w-full overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold text-slate-900 shadow">
            {formatTRY(item.price)}
          </div>
        </div>
      )}
      <div className="p-4">
        <h3 className="text-base font-semibold text-slate-900 line-clamp-1">{item.name}</h3>
        {item.description && (
          <p className="mt-1 text-sm text-slate-600 line-clamp-2">{item.description}</p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-900 md:hidden">{formatTRY(item.price)}</span>
          <button className="btn btn-primary hover:scale-[1.02] active:scale-[0.98]" onClick={onAdd}>Sepete Ekle</button>
        </div>
      </div>
    </div>
  )
}
