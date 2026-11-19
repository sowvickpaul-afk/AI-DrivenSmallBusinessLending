'use client'

import { useEffect, useState } from 'react'

const navigation = [
  { label: 'Dashboard', href: '#overview', icon: '▦' },
  { label: 'Application', href: '#application', icon: '▤' },
  { label: 'Cash flow', href: '#cash-flow', icon: '⌁' },
  { label: 'Repayment lab', href: '/repayment-lab', icon: '↗' },
]

const resources = [
  { label: 'Data connections', href: '#data-connections', icon: '⌘' },
  { label: 'Business profile', href: '#profile', icon: '◇' },
  { label: 'Help center', href: '#help-center', icon: '?' },
]

function Mark() {
  return (
    <span className="flex h-7 items-end gap-0.5 skew-x-[-8deg]" aria-hidden="true">
      <i className="h-3 w-1.5 bg-[#111a18]" />
      <i className="h-5 w-1.5 bg-[#111a18]" />
      <i className="h-7 w-1.5 bg-[#91a98b]" />
    </span>
  )
}

export default function DashboardSidebar({
  firstName,
  lastName,
  email,
  initials,
}: {
  firstName: string
  lastName: string
  email: string
  initials: string
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('Dashboard')

  useEffect(() => {
    const syncActiveLink = () => {
      const hash = window.location.hash
      const item = [...navigation, ...resources].find((link) => link.href === hash)
      setActive(item?.label ?? 'Dashboard')
    }

    syncActiveLink()
    window.addEventListener('hashchange', syncActiveLink)
    return () => window.removeEventListener('hashchange', syncActiveLink)
  }, [])

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const links = (items: typeof navigation) =>
    items.map((item) => (
      <a
        key={item.label}
        href={item.href}
        onClick={() => {
          setActive(item.label)
          setOpen(false)
        }}
        className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-[11px] transition ${
          active === item.label
            ? 'bg-[#e7e7e9] font-semibold text-[#111a18]'
            : 'text-[#555b58] hover:bg-[#ececee] hover:text-[#111a18]'
        }`}
      >
        <span className="grid h-4 w-4 place-items-center text-[13px]" aria-hidden="true">
          {item.icon}
        </span>
        {item.label}
        {item.label === 'Application' && (
          <span className="ml-auto rounded bg-[#111a18] px-1.5 py-0.5 text-[7px] text-white">
            2
          </span>
        )}
      </a>
    ))

  return (
    <>
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#dddddf] bg-[#f7f7f9] px-5 lg:hidden">
        <a href="/" className="flex items-end gap-2 text-lg font-bold tracking-[-.04em]">
          <Mark />
          Credit<span className="text-[#70826d]">Dibe</span>
        </a>
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-md border border-[#d6d6d8] bg-white"
          onClick={() => setOpen(true)}
          aria-label="Open dashboard navigation"
          aria-controls="dashboard-sidebar"
          aria-expanded={open}
        >
          <span className="space-y-1">
            <i className="block h-px w-4 bg-[#111a18]" />
            <i className="block h-px w-4 bg-[#111a18]" />
            <i className="block h-px w-4 bg-[#111a18]" />
          </span>
        </button>
      </div>

      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[#111a18]/35 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close dashboard navigation"
        />
      )}

      <aside
        id="dashboard-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[min(84vw,260px)] flex-col border-r border-[#e3e3e5] bg-[#f7f7f9] text-[#111a18] shadow-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-[calc(100vh-48px)] lg:w-auto lg:translate-x-0 lg:shadow-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[72px] items-center justify-between px-5">
          <a href="/" className="flex items-end gap-2 text-[17px] font-bold tracking-[-.04em]">
            <Mark />
            Credit<span className="text-[#70826d]">Dibe</span>
          </a>
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded border border-[#dddddf] text-lg text-[#6d7470] lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close dashboard navigation"
          >
            ×
          </button>
          <span className="hidden text-[#8a8f8c] lg:block">«</span>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <p className="px-3 pt-3 pb-2 text-[9px] font-medium text-[#8a8f8c]">Overview</p>
          <div role="navigation" aria-label="Dashboard navigation">
            {links(navigation)}
          </div>
          <p className="px-3 pt-6 pb-2 text-[9px] font-medium text-[#8a8f8c]">Resources</p>
          <div role="navigation" aria-label="Dashboard resources">
            {links(resources)}
          </div>
        </div>

        <div className="border-t border-[#e3e3e5] p-3">
          <div className="flex items-center gap-3 rounded-md p-2">
            <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[#dce9d6] text-[10px] font-bold">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <b className="block truncate text-[10px]">
                {firstName} {lastName}
              </b>
              <span className="block truncate text-[8px] text-[#858a87]">{email}</span>
            </div>
            <span className="text-xs text-[#8c918e]">⌃</span>
          </div>
          <form action="/logout" method="post">
            <button className="mt-1 w-full rounded-md px-3 py-2 text-left text-[9px] text-[#707672] hover:bg-[#e8e8ea]">
              Log out
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
