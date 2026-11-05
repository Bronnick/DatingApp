export function formatLongDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatMediumDateTime(value: string): string {
  return new Date(value).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'medium' })
}

export function formatShortDateTime(value: string): string {
  return new Date(value).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })
}

const intervals: [string, number][] = [
  ['year', 31536000],
  ['month', 2592000],
  ['week', 604800],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
  ['second', 1],
]

export function timeAgo(value: string): string {
  if (!value) return value
  const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000)
  if (seconds < 29) return 'Just now'

  for (const [unit, size] of intervals) {
    const count = Math.floor(seconds / size)
    if (count > 0) return `${count} ${unit}${count === 1 ? '' : 's'} ago`
  }
  return value
}
