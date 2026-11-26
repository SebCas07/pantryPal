import { useCallback, useEffect, useState } from 'react'
import * as api from './api'
import Dashboard from './components/Dashboard.jsx'
import FilterBar from './components/FilterBar.jsx'
import ItemForm from './components/ItemForm'
import ItemList from './components/ItemList'

function App() {
  const [items, setItems] = useState([])
  const [dashboard, setDashboard] = useState(null)
  const [categories, setCategories] = useState([])
  const [editing, setEditing] = useState(null)
  const [filters, setFilters] = useState({ q: '', category: '', status: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const refresh = useCallback(async () => {
    try {
      const [list, dash, categoryList] = await Promise.all([
        api.listItems(filters),
        api.dashboard(),
        api.getCategories(),
      ])
      setItems(list)
      setDashboard(dash)
      setCategories(categoryList)
      setError('')
    } catch (requestError) {
      setError(
        requestError instanceof TypeError
          ? "Can't reach the PantryPal API. Is the backend running?"
          : requestError.message,
      )
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    const timer = setTimeout(refresh, 250)
    return () => clearTimeout(timer)
  }, [filters, refresh])

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

  async function handleDelete(id) {
    setIsSubmitting(true)
    setError('')
    setMessage('')

    try {
      await api.deleteItem(id)
      if (editing?.id === id) {
        setEditing(null)
      }
      await refresh()
      setMessage('Item removed from your pantry.')
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

      {dashboard && <Dashboard data={dashboard} />}

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
        <h2 id="items-title">
          Pantry ({items.length}
          {filters.q || filters.category || filters.status ? ' matching' : ''})
        </h2>
        <FilterBar
          filters={filters}
          categories={categories}
          onChange={setFilters}
        />
        {isLoading ? (
          <p>Loading pantry items...</p>
        ) : (
          <ItemList
            items={items}
            filtered={Boolean(filters.q || filters.category || filters.status)}
            onEdit={(item) => {
              setEditing(item)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onDelete={handleDelete}
          />
        )}
      </section>
    </main>
  )
}

export default App
