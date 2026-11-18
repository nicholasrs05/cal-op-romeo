import type { UserItem } from '../schema/types.ts'

export interface CalendarDate {
  year: number
  month: number // 1-12
  day: number
}

export interface BirthdayEntry {
  person: UserItem
  birthDate: CalendarDate
}

export const WEEKDAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

export function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
}

export function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28
  if ([4, 6, 9, 11].includes(month)) return 30
  return 31
}

export function parseBirthDate(person: UserItem): CalendarDate | null {
  const values = [person.tgllahir, person.blnlahir, person.thnlahir]
  const [day, month, year] = values.map((value) => {
    if (typeof value === 'number') return value
    return typeof value === 'string' && /^\d+$/.test(value.trim()) ? Number(value.trim()) : NaN
  })
  if (
    !Number.isSafeInteger(day) || !Number.isSafeInteger(month) ||
    !Number.isSafeInteger(year) || year < 1 || year > 9999 ||
    month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)
  ) return null

  return { year, month, day }
}

export function partitionBirthdays(people: UserItem[]): {
  birthdays: BirthdayEntry[]
  invalid: UserItem[]
} {
  const birthdays: BirthdayEntry[] = []
  const invalid: UserItem[] = []

  for (const person of people) {
    const birthDate = parseBirthDate(person)
    if (birthDate) birthdays.push({ person, birthDate })
    else invalid.push(person)
  }

  return { birthdays, invalid }
}

export function birthdaysOn(entries: BirthdayEntry[], date: CalendarDate): BirthdayEntry[] {
  return entries.filter(({ birthDate }) =>
    birthDate.month === date.month && birthDate.day === date.day &&
    (date.month !== 2 || date.day !== 29 || isLeapYear(date.year)) &&
    birthDate.year <= date.year,
  )
}

export function displayName(person: UserItem): string {
  return person.panggoaran?.trim() || person.nama
}

export function localDate(date: Date): CalendarDate {
  return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() }
}

export function sameDate(a: CalendarDate, b: CalendarDate): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day
}

export function moveMonth(date: CalendarDate, delta: number): CalendarDate {
  const monthIndex = date.year * 12 + date.month - 1 + delta
  const year = Math.floor(monthIndex / 12)
  const month = monthIndex - year * 12 + 1
  return { year, month, day: Math.min(date.day, daysInMonth(year, month)) }
}

export function moveDay(date: CalendarDate, delta: number): CalendarDate {
  const next = new Date(date.year, date.month - 1, date.day + delta, 12)
  return localDate(next)
}

export function monthCells(year: number, month: number): (number | null)[] {
  const offset = (new Date(year, month - 1, 1, 12).getDay() + 6) % 7
  const days = daysInMonth(year, month)
  const trailing = (7 - (offset + days) % 7) % 7
  return [
    ...Array<null>(offset).fill(null),
    ...Array.from({ length: days }, (_, index) => index + 1),
    ...Array<null>(trailing).fill(null),
  ]
}

const monthFormatter = new Intl.DateTimeFormat('id-ID', { month: 'long' })
const fullDateFormatter = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
})
const birthDateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric', month: 'long', year: 'numeric',
})

export function monthName(month: number): string {
  return monthFormatter.format(new Date(2024, month - 1, 1, 12))
}

export function formatFullDate(date: CalendarDate): string {
  return fullDateFormatter.format(new Date(date.year, date.month - 1, date.day, 12))
}

export function formatBirthDate(date: CalendarDate): string {
  return birthDateFormatter.format(new Date(date.year, date.month - 1, date.day, 12))
}
