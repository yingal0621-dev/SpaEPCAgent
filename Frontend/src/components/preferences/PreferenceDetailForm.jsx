import TypeBadge from '../ui/TypeBadge'
import PreferenceMatrix from './PreferenceMatrix'
import AuditLog from './AuditLog'

export default function PreferenceDetailForm({
  customer,
  preferences,
  doNotContactAll,
  onPreferenceChange,
  onDoNotContactChange,
  onSave,
  onCancel,
  isSaving,
}) {
  return (
    <section className="mt-4 rounded-lg border border-zinc-600/60 bg-zinc-100 p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-zinc-300 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-bold text-zinc-900">{customer.name}</h2>
          <TypeBadge type={customer.type} />
          <span className="text-sm text-zinc-500">
            · {customer.phone} · {customer.email}
          </span>
        </div>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={doNotContactAll}
            onChange={(event) => onDoNotContactChange(event.target.checked)}
            className="h-4 w-4 rounded border-zinc-400 text-red-600 focus:ring-red-500"
          />
          <span className="text-sm font-medium text-red-600">Do Not Contact (all)</span>
        </label>
      </div>

      <PreferenceMatrix
        preferences={preferences}
        onPreferenceChange={onPreferenceChange}
        disabled={doNotContactAll}
      />

      <AuditLog entries={customer.auditLog} />

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="rounded bg-[#2e6da4] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#255a87] disabled:opacity-60"
        >
          {isSaving ? 'Saving…' : 'Save preferences'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          Cancel
        </button>
      </div>
    </section>
  )
}
