import { STATUS_LABELS } from './status.js'

const ORDER = ['expired', 'use_soon', 'this_week', 'fresh', 'none']

export default function Dashboard({ data }) {
  const { counts } = data

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
    </section>
  )
}
