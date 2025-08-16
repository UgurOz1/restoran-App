import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useAdminStore } from '../store/admin'
import { useToastStore } from '../store/toast'
import type { MenuItem } from '../types'
import { deleteMenuItem, loadMenu, upsertMenuItem } from '../services/menu'
import autoAnimate from '@formkit/auto-animate'
import { navigate } from '../utils/router'
import { normalizeImageUrl, extractFirstImageFromPage, toProxyImageUrl } from '../utils/url'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-slate-700 font-medium">{label}</span>
      {children}
    </label>
  )
}

function generateId(name: string) {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  return `${base}-${Math.random().toString(36).slice(2,6)}`
}

export default function Admin() {
  const isAuth = useAdminStore((s) => s.isAuthenticated)
  const login = useAdminStore((s) => s.login)
  const logout = useAdminStore((s) => s.logout)
  const toast = useToastStore((s) => s.show)

  const [password, setPassword] = useState('')
  const [items, setItems] = useState<MenuItem[]>([])
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  const listRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => { if (listRef.current) autoAnimate(listRef.current) }, [])

  useEffect(() => {
    if (!isAuth) return
    ;(async () => { setLoading(true); setItems(await loadMenu()); setLoading(false) })()
  }, [isAuth])

  const categories = useMemo(() => Array.from(new Set(items.map(i => i.category))).sort(), [items])

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const item: MenuItem = {
      id: (fd.get('id') as string) || generateId(fd.get('name') as string),
      name: fd.get('name') as string,
      category: fd.get('category') as string,
      price: Number(fd.get('price') || 0),
      description: (fd.get('description') as string) || undefined,
      image: normalizeImageUrl(fd.get('image') as string) || undefined,
    }
    const next = await upsertMenuItem(item)
    setItems(next)
    setEditing(null)
    setPreviewUrl(undefined)
    toast('Ürün kaydedildi', 'success')
  }

  const onDelete = async (id: string) => {
    const next = await deleteMenuItem(id)
    setItems(next)
    toast('Ürün silindi', 'info')
  }

  if (!isAuth) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <form
          onSubmit={(e) => { e.preventDefault(); login(password) ? toast('Giriş başarılı') : toast('Hatalı parola', 'error') }}
          className="card w-full max-w-sm p-6 bg-white/80 backdrop-blur-xl"
        >
          <h2 className="text-lg font-semibold mb-4 text-center">Admin Giriş</h2>
          <Field label="Parola">
            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900/20" placeholder="admin123" />
          </Field>
          <button className="btn btn-primary w-full mt-4" type="submit">Giriş Yap</button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
        <div className="container-responsive h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/')} className="btn btn-ghost">← Menü</button>
            <h1 className="text-lg font-semibold">Admin</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={logout} className="btn">Çıkış</button>
          </div>
        </div>
      </div>

      <main className="container-responsive py-6 grid lg:grid-cols-[420px,1fr] gap-6">
        <form onSubmit={onSave} className="card p-5 bg-white/80 backdrop-blur-xl">
          <h2 className="text-base font-semibold mb-3">{editing ? 'Ürünü Düzenle' : 'Yeni Ürün'}</h2>
          <input type="hidden" name="id" defaultValue={editing?.id} />
          <div className="grid gap-3">
            <Field label="Ad">
              <input name="name" defaultValue={editing?.name} required className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900/20" />
            </Field>
            <Field label="Kategori">
              <input name="category" list="cats" defaultValue={editing?.category} required className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900/20" />
              <datalist id="cats">
                {categories.map(c => <option key={c} value={c} />)}
              </datalist>
            </Field>
            <Field label="Fiyat (₺)">
              <input name="price" type="number" step="1" min="0" defaultValue={editing?.price ?? 0} required className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900/20" />
            </Field>
            <Field label="Açıklama">
              <textarea name="description" defaultValue={editing?.description} rows={3} className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900/20" />
            </Field>
            <Field label="Görsel URL">
              <div className="grid gap-2">
                <input
                  name="image"
                  defaultValue={editing?.image}
                  onChange={async (e) => {
                    const raw = e.target.value
                    const normalized = normalizeImageUrl(raw)
                    // Eğer normalleştirilmiş url bir web sayfası gibi görünüyorsa, ilk img'yi çekmeyi dene
                    const looksLikeHtmlPage = normalized && /\/[^.]+$/.test(new URL(normalized, window.location.origin).pathname)
                    if (looksLikeHtmlPage) {
                      const img = await extractFirstImageFromPage(normalized!)
                      setPreviewUrl(img || normalized || undefined)
                    } else {
                      setPreviewUrl(normalized || undefined)
                    }
                  }}
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900/20"
                  placeholder="/images/menu/xyz.jpg"
                />
                {(previewUrl || editing?.image) && (
                  <div className="flex items-center gap-3">
                    <img
                      src={toProxyImageUrl(previewUrl || editing?.image) as string}
                      alt="Önizleme"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      className="h-20 w-20 rounded-lg object-cover border border-slate-200"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                    />
                    <span className="text-xs text-slate-500">Önizleme</span>
                  </div>
                )}
              </div>
            </Field>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="btn btn-primary" type="submit">Kaydet</button>
            {editing && <button type="button" className="btn" onClick={() => setEditing(null)}>İptal</button>}
          </div>
        </form>

        <div className="min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card h-40 animate-pulse" />
              ))}
            </div>
          ) : (
            <div ref={listRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {items.map((it) => (
                <div key={it.id} className="card p-4 bg-white/80 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    {it.image && <img src={it.image} alt={it.name} className="h-16 w-16 rounded-lg object-cover" />}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold truncate">{it.name}</div>
                      <div className="text-xs text-slate-500 truncate">{it.category} • ₺{it.price}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="btn btn-primary" onClick={() => setEditing(it)}>Düzenle</button>
                    <button className="btn" onClick={() => onDelete(it.id)}>Sil</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}


