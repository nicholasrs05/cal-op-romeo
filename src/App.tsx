import { BirthdayCalendar } from '@/components/calendar/BirthdayCalendar'
import { PageHeading } from '@/components/layout/PageHeading'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'

function App() {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main className="main-content">
        <PageHeading />
        <BirthdayCalendar />
        <SiteFooter />
      </main>
    </div>
  )
}

export default App
