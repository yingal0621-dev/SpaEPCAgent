export default function TypeBadge({ type }) {
  const isMember = type === 'MEMBER'

  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-bold tracking-wide text-white ${
        isMember ? 'bg-emerald-600' : 'bg-amber-500'
      }`}
    >
      {type}
    </span>
  )
}
