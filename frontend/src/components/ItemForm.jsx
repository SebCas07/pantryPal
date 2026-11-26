import { useState } from 'react'

const categories = [
  'produce',
  'dairy',
  'meat',
  'grains',
  'canned',
  'frozen',
  'snacks',
  'drinks',
  'other',
]

function ItemForm({ initialItem, onSubmit, onCancel, isSubmitting = false, error }) {
  const [form, setForm] = useState({
    name: initialItem?.name ?? '',
    quantity: initialItem?.quantity ?? 1,
    unit: initialItem?.unit ?? '',
    category: initialItem?.category ?? 'other',
    expiration_date: initialItem?.expiration_date ?? '',
  })

  function handleChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit({
      ...form,
      quantity: Number(form.quantity),
      unit: form.unit.trim() || null,
      expiration_date: form.expiration_date || null,
    })
  }

  return (
    <form className="item-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          maxLength={120}
          required
        />
      </label>

      <label>
        Quantity
        <input
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
          min="0"
          step="any"
          required
        />
      </label>

      <label>
        Unit
        <input
          name="unit"
          value={form.unit}
          onChange={handleChange}
          maxLength={30}
        />
      </label>

      <label>
        Category
        <select name="category" value={form.category} onChange={handleChange}>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category[0].toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </label>

      <label>
        Expiration date
        <input
          name="expiration_date"
          type="date"
          value={form.expiration_date}
          onChange={handleChange}
        />
      </label>

      {error && <p role="alert">{error}</p>}

      <div className="item-form__actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialItem ? 'Save changes' : 'Add item'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default ItemForm
