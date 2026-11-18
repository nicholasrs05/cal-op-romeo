import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatFullDate, monthName } from '@/lib/birthdays'
import type { CalendarDate } from '@/lib/birthdays'
import type { View } from './types'

interface Props {
  view: View
  selectedDate: CalendarDate
  currentYear: number
  onNavigate: (delta: number) => void
  onBack: () => void
}

export function CalendarToolbar({ view, selectedDate, currentYear, onNavigate, onBack }: Props) {
  const periodLabel = view === 'year' ? String(currentYear)
    : view === 'month' ? `${monthName(selectedDate.month)} ${selectedDate.year}`
      : formatFullDate(selectedDate)

  return (
    <div className="calendar-toolbar">
      <div className="toolbar-title">
        {view === 'year' ? <p className="toolbar-kicker">KALENDER</p> : (
          <button className="back-button" onClick={onBack}>
            <ArrowLeft size={15} aria-hidden="true" />
            Kembali ke {view === 'day' ? 'bulan' : 'tahun'}
          </button>
        )}
        <h2 aria-live="polite">{periodLabel}</h2>
      </div>
      {view !== 'year' && (
        <div className="navigation" aria-label={`Navigasi ${view === 'day' ? 'hari' : 'bulan'}`}>
          <Button variant="outline" size="icon" onClick={() => onNavigate(-1)}
            aria-label={view === 'day' ? 'Hari sebelumnya' : 'Bulan sebelumnya'}>
            <ChevronLeft aria-hidden="true" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onNavigate(1)}
            aria-label={view === 'day' ? 'Hari berikutnya' : 'Bulan berikutnya'}>
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  )
}
