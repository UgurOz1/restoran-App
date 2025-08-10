/*
  SuccessModal: Sipariş tamamlandı bildirimi
  - Ortada küçük bir kart; arka planda karartma
*/

type Props = { open: boolean; onClose: () => void }

export default function SuccessModal({ open, onClose }: Props) {
  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black/40 animate-in fade-in duration-150" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="card max-w-sm w-full p-6 text-center animate-in zoom-in-95 fade-in duration-200">
          <div className="text-2xl mb-2">🎉</div>
          <h3 className="text-base font-semibold">Siparişiniz alındı</h3>
          <p className="text-sm text-slate-600 mt-1">Afiyet olsun! Hazırlanmaya başlandı.</p>
          <button className="btn btn-primary mt-4 w-full" onClick={onClose}>Kapat</button>
        </div>
      </div>
    </div>
  )
}
