import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { appAuth } from '@/lib/app-auth'
import DashboardSidebar from './dashboard-sidebar'
import DashboardWorkspace from './dashboard-workspace'

export const metadata: Metadata = {
  title: 'Dashboard | CreditDibe',
  description: 'Track your CreditDibe application and business financing readiness.',
}

function formatBusinessAge(establishedMonth: string) {
  const [month, year] = establishedMonth.split('/').map(Number)
  if (!month || !year) return 'Not available'
  const now = new Date()
  const months = Math.max(0, (now.getFullYear() - year) * 12 + now.getMonth() + 1 - month)
  if (months < 12) return `${months} mo.`
  const years = Math.floor(months / 12)
  const remainder = months % 12
  return remainder ? `${years} yr ${remainder} mo.` : `${years} yr`
}

export default async function DashboardPage() {
  const user = await appAuth.currentUser()
  if (!user) redirect('/login')

  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
  const applicationRef = String(user.id).slice(-6).toUpperCase()
  const monthlyRevenue = Number(user.averageMonthlyRevenue)

  return (
    <main className="min-h-screen bg-[#e9e8ed] p-0 text-[#111a18] lg:p-6">
      <div className="mx-auto min-h-screen max-w-[1500px] overflow-hidden bg-white shadow-[0_22px_65px_rgba(28,31,29,.12)] lg:grid lg:min-h-[calc(100vh-48px)] lg:grid-cols-[220px_1fr] lg:rounded-[18px]">
        <DashboardSidebar
          firstName={user.firstName}
          lastName={user.lastName}
          email={user.email}
          initials={initials}
        />
        <DashboardWorkspace
          firstName={user.firstName}
          initials={initials}
          applicationRef={applicationRef}
          revenue={
            Number.isFinite(monthlyRevenue) ? monthlyRevenue.toLocaleString() : 'Not available'
          }
          businessAge={formatBusinessAge(user.establishedMonth)}
          establishedMonth={user.establishedMonth}
        />
      </div>
    </main>
  )
}
