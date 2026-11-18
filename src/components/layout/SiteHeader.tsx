import { Cake } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="brand-mark"><Cake size={22} strokeWidth={2.1} aria-hidden="true" /></div>
      <div className="brand-name">ULANG TAHUN <span>POMPARAN OP. ROMEO</span></div>
    </header>
  )
}
