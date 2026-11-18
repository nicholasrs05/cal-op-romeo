import { useState } from 'react'
import { flushSync } from 'react-dom'
import { CalendarStatus } from './CalendarStatus'
import { CalendarToolbar } from './CalendarToolbar'
import { DayView } from './DayView'
import { InvalidRecords } from './InvalidRecords'
import { MonthView } from './MonthView'
import { TodayBanner } from './TodayBanner'
import { YearView } from './YearView'
import type { View } from './types'
import { useBirthdayData } from '@/hooks/useBirthdayData'
import { useLocalToday } from '@/hooks/useLocalToday'
import { birthdaysOn, localDate, moveDay, moveMonth } from '@/lib/birthdays'

export function BirthdayCalendar() {
  const today = useLocalToday()
  // const today = { year: 2026, month: 7, day: 16 }
  const { loadState, birthdays, invalid, retry } = useBirthdayData()
  const [selectedDate, setSelectedDate] = useState(() => localDate(new Date()))
  const [view, setView] = useState<View>(() =>
    window.matchMedia('(max-width: 500px)').matches ? 'month' : 'year')
  const todayBirthdays = birthdaysOn(birthdays, today)
  const nativeTransitions = typeof document.startViewTransition === 'function' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const transition = (update: () => void) => {
    if (nativeTransitions) document.startViewTransition(() => flushSync(update))
    else update()
  }

  const navigate = (delta: number) => {
    transition(() => setSelectedDate((date) => view === 'day' ? moveDay(date, delta) : moveMonth(date, delta)))
  }
  const openMonth = (month: number) => {
    transition(() => {
      setSelectedDate({ year: today.year, month, day: 1 })
      setView('month')
    })
  }
  const openDay = (day: number) => {
    transition(() => {
      setSelectedDate((date) => ({ ...date, day }))
      setView('day')
    })
  }
  const openToday = () => {
    transition(() => {
      setSelectedDate(today)
      setView('day')
    })
  }
  const goBack = () => transition(() => setView(view === 'day' ? 'month' : 'year'))
  const viewKey = view === 'year' ? `year-${today.year}`
    : view === 'month' ? `month-${selectedDate.year}-${selectedDate.month}`
      : `day-${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`

  return (
    <>
      {loadState.status === 'ready' && todayBirthdays.length > 0 && (
        <TodayBanner today={today} birthdays={todayBirthdays} onOpen={openToday} />
      )}

      <section className={`calendar-panel${nativeTransitions ? ' native-transitions' : ''}`} aria-label="Kalender ulang tahun">
        <CalendarToolbar view={view} selectedDate={selectedDate} currentYear={today.year}
          onNavigate={navigate} onBack={goBack} />

        {loadState.status !== 'ready' && (
          <CalendarStatus status={loadState.status}
            message={loadState.status === 'error' ? loadState.message : undefined} onRetry={retry} />
        )}
        {loadState.status === 'ready' && (
          <>
            {loadState.users.length === 0 && (
              <div className="empty-data" role="status">Belum ada data ulang tahun dari API.</div>
            )}
            <div className="calendar-view" key={viewKey}>
              {view === 'year' && <YearView year={today.year} today={today} birthdays={birthdays} onOpenMonth={openMonth} />}
              {view === 'month' && <MonthView date={selectedDate} today={today} birthdays={birthdays} onOpenDay={openDay} />}
              {view === 'day' && <DayView date={selectedDate} birthdays={birthdays} />}
            </div>
          </>
        )}
      </section>

      {loadState.status === 'ready' && invalid.length > 0 && <InvalidRecords people={invalid} />}
    </>
  )
}
