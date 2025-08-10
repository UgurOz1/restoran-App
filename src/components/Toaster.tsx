/*
  Toaster: Ortada görünen küçük bildirim kutusu
  - src/store/toast'tan toasts dizisini okur ve sırayla gösterir
  - İkon + renk varyantları + otomatik kapanma ilerleme çubuğu
*/
import { useToastStore } from '../store/toast'
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'

export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const remove = useToastStore((s) => s.remove)

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] grid place-items-center p-4">
      <div className="w-full max-w-sm space-y-3">
        {toasts.map((t) => {
          const isSuccess = t.variant === 'success'
          const isError = t.variant === 'error'
          const Icon = isSuccess ? CheckCircleIcon : isError ? ExclamationTriangleIcon : InformationCircleIcon
          const border = isSuccess ? 'border-green-200' : isError ? 'border-red-200' : 'border-sky-200'
          const iconBg = isSuccess ? 'bg-green-100 text-green-600' : isError ? 'bg-red-100 text-red-600' : 'bg-sky-100 text-sky-600'
          const progress = isSuccess ? 'bg-green-500' : isError ? 'bg-red-500' : 'bg-sky-500'

          return (
            <div
              key={t.id}
              className={`pointer-events-auto relative mx-auto flex items-center gap-3 rounded-2xl border ${border} p-4 shadow-xl ring-1 ring-black/5 backdrop-blur bg-white/90 animate-in fade-in zoom-in duration-200`}
              role="status"
              aria-live="polite"
            >
              <div className={`grid h-9 w-9 place-items-center rounded-full ${iconBg}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-900 flex-1 text-left">{t.message}</p>
              <button className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100" onClick={() => remove(t.id)} aria-label="Kapat">
                <XMarkIcon className="h-4 w-4" />
              </button>
              <div className="absolute left-0 bottom-0 h-0.5 w-full overflow-hidden rounded-b-2xl bg-slate-200/60">
                <span className={`block h-full ${progress} toast-progress`} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
