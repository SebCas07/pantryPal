import { useEffect, useState } from 'react'
import * as api from './api'
import ItemForm from './components/ItemForm'
import ItemList from './components/ItemList'

const dashboardStatuses = [
  ['expired', 'Expired'],
  ['use_soon', 'Use soon'],
  ['this_week', 'This week'],
  ['fresh', 'Fresh'],
  ['none', 'No expiration date'],
]

async function fetchPantryData() {
  const [items, dashboard, categories] = await Promise.all([
    api.getItems(),
    api.getDashboard(),
    api.getCategories(),
  ])
  return { items, dashboard, categories }
}

function App() {
  const [items, setItems] = useState([])
  const [dashboard, setDashboard] = useState(null)
  const [categories, setCategories] = useState([])
  const [editing, setEditing] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    fetchPantryData()
      .then((data) => {
        if (isMounted) {
          setItems(data.items)
          setDashboard(data.dashboard)
          setCategories(data.categories)
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(requestError.message)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  async function refresh() {
    const data = await fetchPantryData()
    setItems(data.items)
    setDashboard(data.dashboard)
    setCategories(data.categories)
  }

  async function handleSave(item) {
    setIsSubmitting(true)
    setError('')
    setMessage('')

    try {
      if (editing) {
        await api.updateItem(editing.id, item)
        setEditing(null)
        setMessage(`${item.name} was updated.`)
      } else {
        await api.createItem(item)
        setMessage(`${item.name} was added.`)
      }
      await refresh()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="pantry-app">
      <header className="pantry-app__header">
        <p className="pantry-app__eyebrow">PantryPal</p>
        <h1>Your pantry, at a glance</h1>
        <p>Keep track of what you have and use food before it expires.</p>
      </header>

      {error && (
        <p className="pantry-app__error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="pantry-app__message" role="status">
          {message}
        </p>
      )}

      <section className="pantry-app__dashboard" aria-labelledby="dashboard-title">
        <h2 id="dashboard-title">Expiration overview</h2>
        {dashboard ? (
          <dl className="pantry-app__stats">
            {dashboardStatuses.map(([status, label]) => (
              <div className={`pantry-app__stat pantry-app__stat--${status}`} key={status}>
                <dt>{label}</dt>
                <dd>{dashboard.counts[status]}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p>Loading expiration overview...</p>
        )}
      </section>

      <section className="pantry-app__form-section" aria-labelledby="form-title">
        <h2 id="form-title">{editing ? `Edit ${editing.name}` : 'Add an item'}</h2>
        <ItemForm
          key={editing?.id ?? 'new'}
          categories={categories}
          initial={editing}
          onSave={handleSave}
          onCancel={editing ? () => setEditing(null) : null}
          isSubmitting={isSubmitting}
          error={error}
        />
      </section>

      <section className="pantry-app__items" aria-labelledby="items-title">
        <h2 id="items-title">Pantry items</h2>
        {isLoading ? (
          <p>Loading pantry items...</p>
        ) : (
          <ItemList
            items={items}
            onEdit={(item) => {
              setEditing(item)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}
      </section>
    </main>
  )
}

export default App
