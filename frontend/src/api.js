const API_BASE = '/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options)
  const data = response.status === 204 ? null : await response.json()

  if (!response.ok) {
    const message =
      data?.error ??
      (data?.errors ? JSON.stringify(data.errors) : `Request failed (${response.status})`)
    throw new Error(message)
  }

  return data
}

function jsonRequest(method, body) {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

export function getHealth() {
  return request('/health')
}

export function getCategories() {
  return request('/categories')
}

export function getItems() {
  return request('/items')
}

export function getItem(itemId) {
  return request(`/items/${itemId}`)
}

export function createItem(item) {
  return request('/items', jsonRequest('POST', item))
}

export function updateItem(itemId, item) {
  return request(`/items/${itemId}`, { method: "PUT", body: JSON.stringify(item)})
}

export function deleteItem(itemId) {
  return request(`/items/${itemId}`, { method: 'DELETE' })
}

export function getDashboard() {
  return request('/dashboard')
}
