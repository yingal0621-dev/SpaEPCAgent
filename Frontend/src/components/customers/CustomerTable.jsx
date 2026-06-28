import TypeBadge from '../ui/TypeBadge'

const COLUMNS = ['NAME', 'TYPE', 'MEMBERSHIP #', 'LOCATION', 'PHONE']

export default function CustomerTable({
  customers,
  searchLabel,
  selectedCustomerId,
  onSelectCustomer,
}) {
  return (
    <section className="mt-4">
      <p className="mb-2 text-sm text-zinc-400">
        {customers.length} {customers.length === 1 ? 'match' : 'matches'} for &apos;{searchLabel}&apos;
        {' '}— select a contact
      </p>

      <div className="overflow-hidden rounded-lg border border-zinc-600/60 bg-zinc-100">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-300 bg-zinc-200/80">
              {COLUMNS.map((column) => (
                <th
                  key={column}
                  className="px-4 py-2.5 text-xs font-semibold tracking-wide text-zinc-600"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => {
              const isSelected = customer.id === selectedCustomerId

              return (
                <tr
                  key={customer.id}
                  onClick={() => onSelectCustomer(customer.id)}
                  className={`cursor-pointer border-b border-zinc-200 transition last:border-b-0 ${
                    isSelected
                      ? 'bg-blue-100/80'
                      : 'bg-white hover:bg-blue-50/60'
                  }`}
                >
                  <td className="px-4 py-2.5 font-medium text-zinc-800">{customer.name}</td>
                  <td className="px-4 py-2.5">
                    <TypeBadge type={customer.type} />
                  </td>
                  <td className="px-4 py-2.5 text-zinc-600">
                    {customer.membershipNumber ?? '—'}
                  </td>
                  <td className="px-4 py-2.5 text-zinc-600">{customer.location}</td>
                  <td className="px-4 py-2.5 text-zinc-600">{customer.phone}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
