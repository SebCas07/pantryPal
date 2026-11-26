import { STATUS_LABELS, expiryText } from './status.js'

export default function ItemList({
  items,
  filtered = false,
  onEdit,
  onDelete,
}) {
  if (items.length === 0) {
    return (
      <p className="empty">
        {filtered
          ? 'No items match these filters.'
          : 'Your pantry is empty. Add your first item above.'}
      </p>
    )
  }

  return (
    <div className="item-list__container">
      <table className="item-list">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Quantity</th>
            <th scope="col">Category</th>
            <th scope="col">Expires</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <th scope="row">{item.name}</th>
              <td>
                {item.quantity}
                {item.unit ? ` ${item.unit}` : ''}
              </td>
              <td>{item.category}</td>
              <td>
                <span
                  className={`pill ${item.status}`}
                  title={STATUS_LABELS[item.status]}
                >
                  {expiryText(item)}
                </span>
              </td>
              <td className="row-actions">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => onEdit(item)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => onDelete(item.id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
