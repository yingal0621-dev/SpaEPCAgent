import { Search } from 'lucide-react'

const FIELDS = [
  { key: 'firstName', label: 'First Name', placeholder: '' },
  { key: 'lastName', label: 'Last Name', placeholder: '' },
  { key: 'email', label: 'Email', placeholder: '' },
  { key: 'phone', label: 'Phone', placeholder: '' },
  { key: 'address', label: 'Address', placeholder: '' },
  { key: 'membershipNumber', label: 'Membership #', placeholder: '' },
]

export default function SearchBar({ values, onChange, onSearch, onClear, isSearching }) {
  const handleSubmit = (event) => {
    event.preventDefault()
    onSearch()
  }

  return (
    <section className="rounded-lg border border-zinc-600/60 bg-zinc-100 px-5 py-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-zinc-700">
        Search members &amp; non-members
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
        {FIELDS.map(({ key, label, placeholder }) => (
          <label key={key} className="flex min-w-[120px] flex-1 flex-col gap-1">
            <span className="text-xs font-medium text-zinc-600">{label}</span>
            <input
              type="text"
              value={values[key]}
              onChange={(event) => onChange(key, event.target.value)}
              placeholder={placeholder}
              className="rounded border border-zinc-300 bg-white px-2.5 py-1.5 text-sm text-zinc-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </label>
        ))}

        <div className="flex shrink-0 gap-2 pb-0.5">
          <button
            type="submit"
            disabled={isSearching}
            className="inline-flex items-center gap-1.5 rounded bg-[#2e6da4] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#255a87] disabled:opacity-60"
          >
            <Search className="h-4 w-4" />
            {isSearching ? 'Searching…' : 'Search'}
          </button>
          <button
            type="button"
            onClick={onClear}
            className="rounded border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            Clear
          </button>
        </div>
      </form>
    </section>
  )
}
