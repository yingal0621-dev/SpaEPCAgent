import { PREFERENCE_TOPICS } from '../../data/mockCustomers'

const CHANNELS = ['call', 'email', 'sms', 'mail']
const CHANNEL_LABELS = ['CALL', 'EMAIL', 'SMS', 'MAIL']

export default function PreferenceMatrix({ preferences, onPreferenceChange, disabled }) {
  return (
    <div className="overflow-hidden rounded border border-zinc-300">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-zinc-300 bg-zinc-50">
            <th className="px-4 py-2 text-left text-xs font-semibold tracking-wide text-zinc-600">
              TOPIC
            </th>
            {CHANNEL_LABELS.map((label) => (
              <th
                key={label}
                className="w-20 px-2 py-2 text-center text-xs font-semibold tracking-wide text-zinc-600"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PREFERENCE_TOPICS.map((topic) => (
            <tr
              key={topic.id}
              className={`border-b border-zinc-200 last:border-b-0 ${
                topic.isGlobal ? 'bg-blue-50/70' : 'bg-white'
              }`}
            >
              <td className="px-4 py-2.5">
                <div className={`${topic.isGlobal ? 'font-medium text-zinc-800' : ''}`}>
                  <span className={topic.isGlobal ? '' : 'font-semibold text-zinc-800'}>
                    {topic.label}
                  </span>
                  {topic.description && (
                    <p className="mt-0.5 text-xs text-zinc-500">{topic.description}</p>
                  )}
                </div>
              </td>
              {CHANNELS.map((channel) => (
                <td key={channel} className="px-2 py-2.5 text-center">
                  <input
                    type="checkbox"
                    checked={preferences[topic.id]?.[channel] ?? false}
                    disabled={disabled}
                    onChange={(event) =>
                      onPreferenceChange(topic.id, channel, event.target.checked)
                    }
                    className="h-4 w-4 rounded border-zinc-400 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
