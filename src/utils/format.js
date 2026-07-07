export function formatDuration(seconds) {
  if (!seconds || seconds < 0) return '0h 0m'
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  return `${hrs}h ${mins}m`
}

export function formatElapsed(seconds) {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
}

export function formatMoney(amount) {
  if (amount === null || amount === undefined) return '₹0'
  return `₹${Number(amount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const STATUS_CONFIG = {
  inquiry: { label: 'Inquiry', color: '#9a9a9d' },
  confirmed: { label: 'Confirmed', color: '#3ecf8e' },
  in_progress: { label: 'In Progress', color: '#f0b429' },
  completed: { label: 'Completed', color: '#4ade80' },
  on_hold: { label: 'On Hold', color: '#f3716f' },
  cancelled: { label: 'Cancelled', color: '#5e5e62' },
}

export const PRIORITY_CONFIG = {
  low: { label: 'Low', color: '#9a9a9d' },
  med: { label: 'Medium', color: '#f0b429' },
  high: { label: 'High', color: '#f3716f' },
}
