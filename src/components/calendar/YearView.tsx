import { birthdaysOn, daysInMonth, monthCells, monthName, sameDate, WEEKDAYS } from '@/lib/birthdays'
import type { BirthdayEntry, CalendarDate } from '@/lib/birthdays'

const SHORT_WEEKDAYS = ['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Mg']

interface Props {
  year: number
  today: CalendarDate
  birthdays: BirthdayEntry[]
  onOpenMonth: (month: number) => void
}

export function YearView({ year, today, birthdays, onOpenMonth }: Props) {
  return (
    <div className="year-grid">
      {Array.from({ length: 12 }, (_, index) => {
        const month = index + 1
        const isCurrentMonth = year === today.year && month === today.month
        const count = birthdays.filter(({ birthDate }) =>
          birthDate.month === month && birthDate.year <= year && birthDate.day <= daysInMonth(year, month),
        ).length

        return (
          <button className={`mini-month${isCurrentMonth ? ' is-current-month' : ''}`} key={month}
            onClick={() => onOpenMonth(month)}
            aria-label={`Buka bulan ${monthName(month)} ${year}${isCurrentMonth ? ', bulan ini' : ''}${count ? `, ${count} ulang tahun` : ''}`}>
            <div className="mini-month-heading">
              <span className="mini-month-title">{monthName(month)}</span>
              <span className="mini-month-meta">
                {count > 0 && <span className="mini-count">{count}</span>}
              </span>
            </div>
            <div className="mini-calendar">
              {WEEKDAYS.map((weekday, index) =>
                <span className="mini-weekday" data-short={SHORT_WEEKDAYS[index]} key={weekday}>{weekday}</span>)}
              {monthCells(year, month).map((day, index) => {
                if (day === null) return <span className="mini-day empty" key={`blank-${index}`} />
                const date = { year, month, day }
                const hasBirthday = birthdaysOn(birthdays, date).length > 0
                const isToday = sameDate(today, date)
                return (
                  <span key={day} className={`mini-day${hasBirthday ? ' has-birthday' : ''}${isToday ? ' is-today' : ''}`}
                    aria-current={isToday ? 'date' : undefined}
                    aria-label={`${day} ${monthName(month)}${hasBirthday ? ', ada ulang tahun' : ''}${isToday ? ', hari ini' : ''}`}>
                    {day}{hasBirthday && <span className="mini-dot" aria-hidden="true" />}
                  </span>
                )
              })}
            </div>
          </button>
        )
      })}
    </div>
  )
}
