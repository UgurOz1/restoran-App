/*
  Background: Sayfa arka planı için dekoratif katmanlar
  - Radial gradient + hafif grid overlay
*/
export default function Background() {
    return (
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-ornament" />
        <div className="absolute inset-0 bg-grid-overlay opacity-60" />
      </div>
    )
  }
  