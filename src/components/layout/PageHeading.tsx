import { Gift } from 'lucide-react'

export function PageHeading() {
  return (
    <section className="page-heading" aria-labelledby="page-title">
      <div>
        <p className="eyebrow"><span className="eyebrow-line" /> MOMEN SPESIAL</p>
        <h1 id="page-title">Hari-hari untuk <em>dirayakan.</em></h1>
      </div>
      <div className="heading-art" aria-hidden="true"><Gift size={48} strokeWidth={1.3} /></div>
    </section>
  )
}
