import { useEffect } from 'react'
import { CheckCircle2, X } from 'lucide-react'

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-950 px-4 py-3 shadow-2xl shadow-emerald-900/40">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
        <p className="text-sm font-medium text-emerald-50">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 rounded p-0.5 text-emerald-300 transition hover:bg-emerald-900 hover:text-white"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
