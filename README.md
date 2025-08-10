# Restoran Menü & Sepet Uygulaması (React + TypeScript + Vite + Tailwind + Zustand)

Modern bir restoran menü uygulaması. Kategorilere (Tümü, Başlangıç, Ara Sıcak, Çorba, Ana Yemek, Tatlı, İçecek) göre filtreleme, fotoğraflı kartlar, sağdan açılan sepet, adet arttır/azalt/kaldır, ara toplam ve sipariş tamamlama popup’ı içerir. Sepet localStorage ile kalıcıdır. UI; cam/blur efektleri, yumuşak geçişler ve mikro animasyonlar barındırır.

## Özellikler
- **Menü ve Kategoriler**: Tümü dahil sekmeler; grid kartlar; ürün görseli, açıklama ve fiyat.
- **Sepet**: Ekle/Arttır/Azalt/Kaldır; toplam tutar; sağdan açılan çekmece; sipariş sonrası başarı popup.
- **Kalıcılık**: Sepet `localStorage` üzerinde `restaurant-cart` anahtarıyla saklanır.
- **Animasyonlar**: Auto‑animate ile liste/grid animasyonları; `tailwindcss-animate` ile giriş/çıkış animasyonları.
- **Bildirim**: Sepete eklemede ortada görünen hafif bir toast.
- **Mock Veri**: `public/menu.json` üzerinden async fetch.
- **Görseller**: `public/images/menu/` klasöründeki dosyalarla eşleşecek biçimde ayarlanmıştır.

## Hızlı Başlangıç
Gereksinimler: Bun 1.2+ veya Node 18+ (npm/yarn/pnpm de kullanılabilir)

Bun ile:
```sh
bun install
bun dev
```

npm ile:
```sh
npm install
npm run dev
```

Build/Preview:
```sh
bun run build
bun run preview
```

## Proje Yapısı (özet)
```
src/
  components/     # UI bileşenleri (Header, CategoryTabs, MenuCard, CartDrawer, Toaster, Background, SuccessModal)
  services/       # fetchMenu (mock menü verisi)
  store/          # Zustand store’ları (cart, toast)
  utils/          # Yardımcılar (para formatlama)
  types.ts        # Tipler (MenuItem, CartItem)
public/
  menu.json       # Mock menü verisi
  images/menu/    # Ürün görselleri 
```

## Mimari Notlar
- **Veri**: `fetchMenu()` fonksiyonu, `public/menu.json` dosyasını `fetch('/menu.json')` ile alır. Build ortamında public köküne kopyalanır.
- **Global Store**: `src/store/cart.ts` Zustand + `persist` middleware kullanır. Sepet öğeleri `Record<id, {product, quantity}>` olarak saklanır. `isOpen` ile çekmece durumu yönetilir.
- **Seçiciler**: `selectCount` (toplam adet), `selectTotal` (tutar) saf fonksiyonlar olarak dışa aktarılır.
- **UI Akışı**: `App` → `Header` (sepet ikonu/badge), `CategoryTabs`, içerik grid’i (MenuCard’lar), `CartDrawer`, `Toaster`, `Background`.
- **Animasyon**: Auto‑animate liste ve grid konteynerine bir kez bağlanır. Çekmece/overlay ve modal için `tailwindcss-animate` sınıfları kullanılır.
- **Kalıcılık**: `persist` storage `localStorage` ile yapılandırılmıştır. Sayfa yenilense de sepet korunur.

## Görseller
- Görselleri `public/images/menu/` klasörüne ekleyin ve `public/menu.json` içindeki `image` alanlarıyla eşleştirin. Bu repo haliyle şu dosya adlarını bekler: `bruschetta.jpg, humus.jpeg, sigara_boregi.jpg, pacanga_boregi.webp, mercimek_corbasi.webp, ezogelin_corbasi.jpeg, izgara_kofte.jpg, tavuk_sis.jpg, sufle.webp, baklava.jpg, ayran.jpg, gazoz.jpg`.
- Farklı isim kullanacaksanız, `public/menu.json`’u güncelleyin.

## Komutlar
- `bun dev` / `npm run dev`: Geliştirme sunucusu
- `bun run build` / `npm run build`: Üretim build’i
- `bun run preview` / `npm run preview`: Build önizleme

## Geliştirme İpuçları
- Tasarım Tailwind ile kuruldu; `tailwindcss-animate` eklentisi aktiftir.
- Arka plan desenleri `src/index.css` içinde `.bg-ornament` ve `.bg-grid-overlay` sınıflarıyla yönetilir, `Background` bileşeni sayfaya ekler.
- UI/UX iyileştirmeleri: hover mikro etkileşimler, sticky başlık ve sekmeler, iskelet yükleme.

## Yol Haritası (opsiyonel)
- Kupon/indirim ve teslimat ücreti desteği
- Karanlık tema
- Admin paneli (menü yönetimi)

---
Bu proje Bun ile rahatça çalışır, Node/npm kullananlar için de komutlar eşdeğer verilmiştir.
