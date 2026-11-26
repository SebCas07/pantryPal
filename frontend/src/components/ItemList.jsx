function ItemList({ items = [], onEdit, onDelete }) {
  if (items.length === 0) {
    return <p className="item-list__empty">Your pantry is empty.</p>
  }

  return (
    <div className="item-list__container">
      <table className="item-list">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Quantity</th>
            <th scope="col">Category</th>
            <th scope="col">Expiration date</th>
            <th scope="col">Status</th>
            {(onEdit || onDelete) && <th scope="col">Actions</th>}
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
              <td>{item.expiration_date || 'No expiration date'}</td>
              <td>
                <span
                  className={`item-list__status item-list__status--${item.status}`}
                >
                  {item.status.replaceAll('_', ' ')}
                </span>
              </td>
              {(onEdit || onDelete) && (
                <td className="item-list__actions">
                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      aria-label={`Edit ${item.name}`}
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      aria-label={`Delete ${item.name}`}
                    >
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ItemList
