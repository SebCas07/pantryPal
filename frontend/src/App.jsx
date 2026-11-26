import { useEffect, useState } from 'react'
import {
  createItem,
  deleteItem,
  getDashboard,
  getItems,
  updateItem,
} from './api'
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
  const [items, dashboard] = await Promise.all([getItems(), getDashboard()])
  return { items, dashboard }
}

function App() {
  const [items, setItems] = useState([])
  const [dashboard, setDashboard] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
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

  async function refreshPantry() {
    const data = await fetchPantryData()
    setItems(data.items)
    setDashboard(data.dashboard)
  }

  async function handleSubmit(item) {
    setIsSubmitting(true)
    setError('')
    setMessage('')

    try {
      if (editingItem) {
        await updateItem(editingItem.id, item)
        setMessage(`${item.name} was updated.`)
      } else {
        await createItem(item)
        setMessage(`${item.name} was added.`)
      }
      await refreshPantry()
      setEditingItem(null)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(itemId) {
    const item = items.find((currentItem) => currentItem.id === itemId)
    if (!item || !window.confirm(`Delete "${item.name}" from your pantry?`)) {
      return
    }

    setIsSubmitting(true)
    setError('')
    setMessage('')

    try {
      await deleteItem(itemId)
      await refreshPantry()
      if (editingItem?.id === itemId) {
        setEditingItem(null)
      }
      setMessage(`${item.name} was deleted.`)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleCancelEdit() {
    setEditingItem(null)
    setError('')
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
        <h2 id="form-title">{editingItem ? 'Edit pantry item' : 'Add to your pantry'}</h2>
        <ItemForm
          key={editingItem?.id ?? 'new-item'}
          initialItem={editingItem}
          onSubmit={handleSubmit}
          onCancel={editingItem ? handleCancelEdit : undefined}
          isSubmitting={isSubmitting}
        />
      </section>

      <section className="pantry-app__items" aria-labelledby="items-title">
        <h2 id="items-title">Pantry items</h2>
        {isLoading ? (
          <p>Loading pantry items...</p>
        ) : (
          <ItemList
            items={items}
            onEdit={setEditingItem}
            onDelete={handleDelete}
          />
        )}
      </section>
    </main>
  )
}

export default App
