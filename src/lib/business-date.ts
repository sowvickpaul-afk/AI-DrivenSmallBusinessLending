const displayMonthPattern = /^(0[1-9]|1[0-2])\/(\d{4})$/
const inputMonthPattern = /^(\d{4})-(0[1-9]|1[0-2])$/

export type FoundedMonthResult = { value: string; error?: never } | { value?: never; error: string }

export function normalizeFoundedMonth(value: unknown, now = new Date()): FoundedMonthResult {
  const raw = typeof value === 'string' ? value.trim().slice(0, 7) : ''
  const inputMatch = raw.match(inputMonthPattern)
  const displayMatch = raw.match(displayMonthPattern)

  const year = inputMatch ? Number(inputMatch[1]) : displayMatch ? Number(displayMatch[2]) : 0
  const month = inputMatch ? Number(inputMatch[2]) : displayMatch ? Number(displayMatch[1]) : 0

  if (!year || !month) {
    return { error: 'Select the month and year your business was founded.' }
  }

  const currentYear = now.getUTCFullYear()
  const currentMonth = now.getUTCMonth() + 1
  if (year > currentYear || (year === currentYear && month > currentMonth)) {
    return { error: 'The business founding date cannot be in the future.' }
  }

  return { value: `${String(month).padStart(2, '0')}/${year}` }
}
