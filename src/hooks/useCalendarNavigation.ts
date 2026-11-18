import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import type { View } from '@/components/calendar/types'
import { daysInMonth, localDate, moveDay, moveMonth, sameDate } from '@/lib/birthdays'
import type { CalendarDate } from '@/lib/birthdays'

interface CalendarLocation {
  view: View
  date: CalendarDate
}

interface CalendarHistoryEntry {
  index: number
  location: CalendarLocation
  yearParentIndex?: number
  monthParent?: { index: number; date: CalendarDate }
}

const historyKey = 'birthdayCalendar'

function validDate(date: CalendarDate): boolean {
  return Number.isSafeInteger(date.year) && date.year >= 1 && date.year <= 9999 &&
    Number.isSafeInteger(date.month) && date.month >= 1 && date.month <= 12 &&
    Number.isSafeInteger(date.day) && date.day >= 1 && date.day <= daysInMonth(date.year, date.month)
}

function storedEntry(state: unknown): CalendarHistoryEntry | null {
  if (!state || typeof state !== 'object' || !(historyKey in state)) return null
  const entry = (state as Record<string, unknown>)[historyKey] as CalendarHistoryEntry
  if (!entry || !Number.isSafeInteger(entry.index) ||
    !entry.location || !['year', 'month', 'day'].includes(entry.location.view) ||
    !entry.location.date || !validDate(entry.location.date)) return null
  return entry
}

function locationFromUrl(): CalendarLocation | null {
  const params = new URLSearchParams(window.location.search)
  const view = params.get('calendar')
  if (view === 'year') return { view, date: localDate(new Date()) }
  if (view !== 'month' && view !== 'day') return null

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(params.get('date') ?? '')
  if (!match) return null
  const date = { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) }
  return validDate(date) ? { view, date } : null
}

function initialLocation(): CalendarLocation {
  const linked = locationFromUrl()
  if (linked) return linked
  return {
    view: window.matchMedia('(max-width: 500px)').matches ? 'month' : 'year',
    date: localDate(new Date()),
  }
}

function locationUrl(location: CalendarLocation): string {
  const url = new URL(window.location.href)
  url.searchParams.set('calendar', location.view)
  if (location.view === 'year') url.searchParams.delete('date')
  else {
    const { year, month, day } = location.date
    url.searchParams.set('date', `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`)
  }
  return `${url.pathname}${url.search}${url.hash}`
}

function historyState(entry: CalendarHistoryEntry): Record<string, unknown> {
  const current = window.history.state
  return { ...(current && typeof current === 'object' ? current : {}), [historyKey]: entry }
}

function transition(update: () => void): void {
  if (typeof document.startViewTransition === 'function' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.startViewTransition(() => flushSync(update))
  } else update()
}

export function useCalendarNavigation(today: CalendarDate) {
  const [location, setLocation] = useState(initialLocation)
  const { view, date: selectedDate } = location
  const nativeTransitions = typeof document.startViewTransition === 'function' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const saved = storedEntry(window.history.state)
    const start = initialLocation()
    if (!saved || saved.location.view !== start.view || !sameDate(saved.location.date, start.date)) {
      window.history.replaceState(historyState({ index: saved?.index ?? 0, location: start }), '')
    }

    const onPopState = (event: PopStateEvent) => {
      const next = storedEntry(event.state)?.location ?? locationFromUrl() ?? initialLocation()
      transition(() => setLocation(next))
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const push = (next: CalendarLocation, parents: Pick<CalendarHistoryEntry, 'yearParentIndex' | 'monthParent'> = {}) => {
    const entry = { index: (storedEntry(window.history.state)?.index ?? 0) + 1, location: next, ...parents }
    window.history.pushState(historyState(entry), '', locationUrl(next))
    return entry
  }

  const replace = (next: CalendarLocation, yearParentIndex?: number) => {
    const entry = storedEntry(window.history.state)
    window.history.replaceState(historyState({ index: entry?.index ?? 0, location: next, yearParentIndex }), '', locationUrl(next))
    transition(() => setLocation(next))
  }

  const navigate = (delta: number) => {
    const entry = storedEntry(window.history.state)
    const date = view === 'day' ? moveDay(selectedDate, delta) : moveMonth(selectedDate, delta)
    const next = { view, date }
    push(next, { yearParentIndex: entry?.yearParentIndex, monthParent: entry?.monthParent })
    transition(() => setLocation(next))
  }

  const openMonth = (month: number) => {
    const next: CalendarLocation = { view: 'month', date: { year: today.year, month, day: 1 } }
    push(next, { yearParentIndex: storedEntry(window.history.state)?.index })
    transition(() => setLocation(next))
  }

  const openDay = (day: number) => {
    const entry = storedEntry(window.history.state)
    const next: CalendarLocation = { view: 'day', date: { ...selectedDate, day } }
    push(next, {
      yearParentIndex: entry?.yearParentIndex,
      monthParent: { index: entry?.index ?? 0, date: selectedDate },
    })
    transition(() => setLocation(next))
  }

  const openToday = () => {
    const entry = storedEntry(window.history.state)
    let monthParent = view === 'month' && selectedDate.year === today.year && selectedDate.month === today.month
      ? { index: entry?.index ?? 0, date: selectedDate }
      : undefined
    let yearParentIndex = view === 'year' ? entry?.index : entry?.yearParentIndex

    if (!monthParent) {
      const month: CalendarLocation = { view: 'month', date: today }
      const monthEntry = push(month, { yearParentIndex })
      monthParent = { index: monthEntry.index, date: today }
      yearParentIndex = monthEntry.yearParentIndex
    }

    const next: CalendarLocation = { view: 'day', date: today }
    push(next, { yearParentIndex, monthParent })
    transition(() => setLocation(next))
  }

  const goBack = () => {
    const entry = storedEntry(window.history.state)
    if (view === 'day') {
      const parent = entry?.monthParent
      if (parent && parent.date.year === selectedDate.year && parent.date.month === selectedDate.month) {
        window.history.go(parent.index - entry.index)
      } else replace({ view: 'month', date: selectedDate }, entry?.yearParentIndex)
    } else if (view === 'month') {
      if (entry?.yearParentIndex !== undefined) window.history.go(entry.yearParentIndex - entry.index)
      else replace({ view: 'year', date: selectedDate })
    }
  }

  return { view, selectedDate, nativeTransitions, navigate, openMonth, openDay, openToday, goBack }
}
