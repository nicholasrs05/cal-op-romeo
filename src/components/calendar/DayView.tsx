import { Cake, CalendarDays, Gift } from 'lucide-react'
import { birthdaysOn, formatBirthDate, formatFullDate } from '@/lib/birthdays'
import type { BirthdayEntry, CalendarDate } from '@/lib/birthdays'

interface Props {
  date: CalendarDate
  birthdays: BirthdayEntry[]
}

export function DayView({ date, birthdays }: Props) {
  const people = birthdaysOn(birthdays, date)

  if (people.length === 0) {
    return (
      <div className="day-empty">
        <div className="empty-icon"><CalendarDays size={28} strokeWidth={1.7} aria-hidden="true" /></div>
        <h3>Belum ada ulang tahun</h3>
        <p>Tidak ada yang berulang tahun pada {formatFullDate(date)}.</p>
      </div>
    )
  }

  return (
    <div className="day-content">
      <div className="day-intro">
        <span className="day-intro-icon"><Cake size={22} aria-hidden="true" /></span>
        <div><strong>{people.length} yang berulang tahun</strong><span>Hari yang patut dirayakan.</span></div>
      </div>
      <div className="person-grid">
        {people.map(({ person, birthDate }, index) => (
          <article className="person-card" key={`${person.id}-${index}`}>
            <div className="person-avatar" aria-hidden="true">{person.nama.trim().charAt(0).toUpperCase() || '★'}</div>
            <div className="person-details">
              <p className="person-eyebrow">SELAMAT ULANG TAHUN</p>
              <h3>
                {person.nama}
                {person.panggoaran?.trim() && <> <span>({person.panggoaran.trim()})</span></>}
              </h3>
              <div className="person-facts">
                <span><CalendarDays size={16} aria-hidden="true" /> Lahir {formatBirthDate(birthDate)}</span>
                <span><Gift size={16} aria-hidden="true" /> {date.year - birthDate.year} tahun</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
