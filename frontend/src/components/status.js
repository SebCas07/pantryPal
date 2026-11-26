const statusLabels = {
  expired: 'Expired',
  use_soon: 'Use soon',
  this_week: 'This week',
  fresh: 'Fresh',
  none: 'No expiration date',
}

export function statusLabel(status) {
  return statusLabels[status] ?? status
}

export function daysText(days) {
  if (days === null || days === undefined) {
    return 'No expiration date'
  }

  if (!Number.isFinite(days)) {
    throw new TypeError('Days until expiration must be a finite number or null.')
  }

  if (days < 0) {
    return `Expired ${Math.abs(days)}d ago`
  }

  if (days === 0) {
    return 'Expires today'
  }

  return `In ${days} ${days === 1 ? 'day' : 'days'}`
}
