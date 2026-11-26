import { STATUS_LABELS, expiryText } from './status.js'

const ORDER = ['expired', 'use_soon', 'this_week', 'fresh', 'none']

export default function Dashboard({ data }) {
  const { counts, use_soon, use_soon_days } = data

  return (
    <section className="card">
      <h2>Expiration dashboard</h2>
      {counts.expired > 0 && (
        <div className="banner error">
          {counts.expired} item{counts.expired > 1 ? 's have' : ' has'} expired.
          Check your pantry.
        </div>
      )}
      <div className="tiles">
        {ORDER.map((status) => (
          <div key={status} className={`tile ${status}`}>
            <span className="tile-count">{counts[status]}</span>
            <span className="tile-label">{STATUS_LABELS[status]}</span>
          </div>
        ))}
      </div>
      <h3>Use soon or toss (expired + next {use_soon_days} days)</h3>
      {use_soon.length === 0 ? (
        <p className="empty">Nothing is about to expire.</p>
      ) : (
        <ul className="use-soon">
          {use_soon.map((item) => (
            <li key={item.id} className={item.status}>
              <strong>{item.name}</strong> — {expiryText(item)}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
