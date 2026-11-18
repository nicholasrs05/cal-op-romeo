import { ArrowRight, Cake } from 'lucide-react'
import { displayName, formatFullDate } from '@/lib/birthdays'
import type { BirthdayEntry, CalendarDate } from '@/lib/birthdays'

interface Props {
  today: CalendarDate
  birthdays: BirthdayEntry[]
  onOpen: () => void
}

export function TodayBanner({ today, birthdays, onOpen }: Props) {
  const names = birthdays.map(({ person }) => displayName(person))
  const celebrants = names.length > 2
    ? `${names.slice(0, -1).join(', ')}, & ${names[names.length - 1]}`
    : names.join(' & ')

  return (
    <section className="today-banner" aria-label="Ulang tahun hari ini">
      <div className="banner-icon"><Cake size={25} aria-hidden="true" /></div>
      <div className="banner-copy">
        <p>{formatFullDate(today)}</p>
        <span className="banner-kicker">HARI INI ADA YANG BERULANG TAHUN</span>
        <h2>Selamat ulang tahun, {celebrants}!</h2>
      </div>
      <button className="banner-link" onClick={onOpen}>
        Lihat detail <ArrowRight size={17} aria-hidden="true" />
      </button>
    </section>
  )
}
