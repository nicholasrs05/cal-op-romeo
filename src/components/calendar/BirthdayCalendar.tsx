import { CalendarStatus } from './CalendarStatus'
import { CalendarToolbar } from './CalendarToolbar'
import { DayView } from './DayView'
import { InvalidRecords } from './InvalidRecords'
import { MonthView } from './MonthView'
import { TodayBanner } from './TodayBanner'
import { YearView } from './YearView'
import { useBirthdayData } from '@/hooks/useBirthdayData'
import { useCalendarNavigation } from '@/hooks/useCalendarNavigation'
import { useLocalToday } from '@/hooks/useLocalToday'
import { birthdaysOn } from '@/lib/birthdays'

export function BirthdayCalendar() {
  const today = useLocalToday()
  const { loadState, birthdays, invalid, retry } = useBirthdayData()
  const { view, selectedDate, nativeTransitions, navigate, openMonth, openDay, openToday, goBack } =
    useCalendarNavigation(today)
  const todayBirthdays = birthdaysOn(birthdays, today)
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
