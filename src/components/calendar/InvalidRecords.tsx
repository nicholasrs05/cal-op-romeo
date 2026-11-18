import type { UserItem } from '@/schema/types'

interface Props { people: UserItem[] }

export function InvalidRecords({ people }: Props) {
  return (
    <section className="invalid-panel" aria-labelledby="invalid-title">
      <div><h2 id="invalid-title">Tanggal perlu diperbaiki</h2>
        <p>Data ini tetap ditampilkan, tetapi belum bisa ditempatkan di kalender.</p></div>
      <ul>{people.map((person, index) => (
        <li key={`${person.id}-${index}`}><strong>{person.nama || 'Tanpa nama'}</strong>
          <span>{[person.tgllahir, person.blnlahir, person.thnlahir].map((value) => value || '—').join(' / ')}</span></li>
      ))}</ul>
    </section>
  )
}
