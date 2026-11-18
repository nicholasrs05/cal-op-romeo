import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  status: 'loading' | 'error'
  message?: string
  onRetry: () => void
}

export function CalendarStatus({ status, message, onRetry }: Props) {
  if (status === 'loading') {
    return (
      <div className="status-panel" role="status">
        <span className="loading-ring" aria-hidden="true" />
        <h3>Memuat kalender...</h3><p>Sedang mengambil data ulang tahun.</p>
      </div>
    )
  }

  return (
    <div className="status-panel" role="alert">
      <div className="status-icon"><RefreshCw size={24} aria-hidden="true" /></div>
      <h3>Kalender belum bisa dimuat</h3><p>{message}</p>
      <Button onClick={onRetry}>Coba lagi</Button>
    </div>
  )
}
