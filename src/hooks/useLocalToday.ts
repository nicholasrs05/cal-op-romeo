import { useEffect, useState } from 'react'
import { localDate } from '@/lib/birthdays'
import type { CalendarDate } from '@/lib/birthdays'

export function useLocalToday(): CalendarDate {
  const [today, setToday] = useState(() => localDate(new Date()))

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const scheduleNextDay = () => {
      const now = new Date()
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      timer = setTimeout(() => {
        setToday(localDate(new Date()))
        scheduleNextDay()
      }, midnight.getTime() - now.getTime() + 100)
    }
    const syncToday = () => setToday(localDate(new Date()))

    scheduleNextDay()
    document.addEventListener('visibilitychange', syncToday)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', syncToday)
    }
  }, [])

  return today
}
