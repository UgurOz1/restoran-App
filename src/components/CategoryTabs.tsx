/*
  CategoryTabs: Kategoriler arasında gezinme
  - Tümü dahil
  - Sticky konumda, scroll sırasında görünür kalır
*/

type Props = {
    /** Gösterilecek kategori adları ("Tümü" dahil gelmeli) */
    categories: string[]
    /** Seçili kategori */
    selected: string
    /** Kategori tıklamasında tetiklenen handler */
    onSelect: (category: string) => void
  }
  
  export default function CategoryTabs({ categories, selected, onSelect }: Props) {
    return (
      <div className="sticky top-16 z-30 border-b border-slate-200 bg-white/70 backdrop-blur-xl">
        <div className="container-responsive overflow-x-auto">
          <div className="flex gap-2 py-3">
            {categories.map((c) => {
              const active = c === selected
              return (
                <button
                  key={c}
                  onClick={() => onSelect(c)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                    active
                      ? 'bg-slate-900 text-white border-slate-900 shadow'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {c}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
  