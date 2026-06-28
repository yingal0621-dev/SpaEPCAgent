export default function AuditLog({ entries }) {
  return (
    <div className="mt-5">
      <h3 className="mb-2 text-sm font-semibold text-zinc-800">
        Consent &amp; opt-in audit log
      </h3>
      <ul className="space-y-2">
        {entries.map((entry) => (
          <li key={entry.id} className="flex gap-2 text-sm">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            <div>
              <p className="font-medium text-zinc-800">{entry.title}</p>
              <p className="text-xs text-zinc-500">{entry.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
