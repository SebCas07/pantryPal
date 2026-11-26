import { STATUS_LABELS } from './status.js'

const statuses = ['expired', 'use_soon', 'this_week', 'fresh', 'none']

export default function FilterBar({ filters, categories, onChange }) {
  function updateFilter(name, value) {
    onChange({ ...filters, [name]: value })
  }

  function clearFilters() {
    onChange({ q: '', category: '', status: '' })
  }

  const hasFilters = filters.q || filters.category || filters.status

  return (
    <div className="filter-bar">
      <input
        type="search"
        aria-label="Search pantry items"
        placeholder="Search items..."
        value={filters.q}
        onChange={(event) => updateFilter('q', event.target.value)}
      />
      <select
        aria-label="Filter by category"
        value={filters.category}
        onChange={(event) => updateFilter('category', event.target.value)}
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category[0].toUpperCase() + category.slice(1)}
          </option>
        ))}
      </select>
      <select
        aria-label="Filter by expiry status"
        value={filters.status}
        onChange={(event) => updateFilter('status', event.target.value)}
      >
        <option value="">All statuses</option>
        {statuses.map((status) => (
          <option key={status} value={status}>
            {STATUS_LABELS[status]}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="secondary"
        onClick={clearFilters}
        disabled={!hasFilters}
      >
        Clear
      </button>
    </div>
  )
}
