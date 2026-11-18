import { birthdaysOn, displayName, monthCells, monthName, sameDate, WEEKDAYS } from '@/lib/birthdays'
import type { BirthdayEntry, CalendarDate } from '@/lib/birthdays'

interface Props {
  date: CalendarDate
  today: CalendarDate
  birthdays: BirthdayEntry[]
  onOpenDay: (day: number) => void
}

export function MonthView({ date, today, birthdays, onOpenDay }: Props) {
  return (
    <div className="month-scroll" role="region" aria-label={`Kalender ${monthName(date.month)} ${date.year}`} tabIndex={0}>
      <div className="month-grid">
        {WEEKDAYS.map((weekday) => <div className="month-weekday" key={weekday}>{weekday}</div>)}
        {monthCells(date.year, date.month).map((day, index) => {
          if (day === null) return <div className="month-empty" key={`blank-${index}`} aria-hidden="true" />
          const cellDate = { year: date.year, month: date.month, day }
          const people = birthdaysOn(birthdays, cellDate)
          const isToday = sameDate(today, cellDate)
          return (
            <button key={day} className={`month-day${people.length ? ' has-birthday' : ''}${isToday ? ' is-today' : ''}`}
              onClick={() => onOpenDay(day)} aria-current={isToday ? 'date' : undefined}
              aria-label={`${day} ${monthName(date.month)} ${date.year}${isToday ? ', hari ini' : ''}${people.length ? `, ${people.length} ulang tahun: ${people.map(({ person }) => displayName(person)).join(', ')}` : ', tidak ada ulang tahun'}`}>
              <span className="day-number">{day}</span>
              {isToday && <span className="today-caption">HARI INI</span>}
              {people.length > 0 && (
                <span className="birthday-list">
                  {people.map(({ person }, personIndex) => (
                    <span className="birthday-chip" key={`${person.id}-${personIndex}`}>
                      <span className="chip-dot" aria-hidden="true" />{displayName(person)}
                    </span>
                  ))}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
