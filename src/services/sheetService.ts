import type { UserItem } from '@/schema/types'

const GAS_URL = import.meta.env.VITE_GAS_URL

export async function fetchUsers(signal?: AbortSignal): Promise<UserItem[]> {
  if (!GAS_URL) throw new Error('Alamat API belum dikonfigurasi.')

  const response = await fetch(GAS_URL, { signal })
  if (!response.ok) throw new Error('Data ulang tahun gagal dimuat. Coba lagi.')

  const result: unknown = await response.json()
  if (
    typeof result !== 'object' || result === null ||
    !('status' in result) || result.status !== 'success' ||
    !('data' in result) || !Array.isArray(result.data)
  ) {
    throw new Error('Format data ulang tahun tidak sesuai.')
  }

  return result.data as UserItem[]
}
