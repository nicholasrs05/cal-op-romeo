import { useEffect, useMemo, useState } from 'react'
import { partitionBirthdays } from '@/lib/birthdays'
import { fetchUsers } from '@/services/sheetService'
import type { UserItem } from '@/schema/types'

export type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; users: UserItem[] }
  | { status: 'error'; message: string }

export function useBirthdayData() {
  const [requestKey, setRequestKey] = useState(0)
  const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    fetchUsers(controller.signal).then(
      (users) => setLoadState({ status: 'ready', users }),
      (error: unknown) => {
        if (!controller.signal.aborted) {
          setLoadState({ status: 'error', message: error instanceof Error ? error.message : 'Data gagal dimuat.' })
        }
      },
    )
    return () => controller.abort()
  }, [requestKey])

  const { birthdays, invalid } = useMemo(
    () => partitionBirthdays(loadState.status === 'ready' ? loadState.users : []),
    [loadState],
  )
  const retry = () => {
    setLoadState({ status: 'loading' })
    setRequestKey((key) => key + 1)
  }

  return { loadState, birthdays, invalid, retry }
}
