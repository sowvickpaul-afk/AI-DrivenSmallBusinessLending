'use client'

import { useEffect, useMemo, useState } from 'react'

type WorkspaceProps = {
  firstName: string
  initials: string
  applicationRef: string
  revenue: string
  businessAge: string
  establishedMonth: string
}

const workflow = [
  {
    title: 'Application',
    count: 2,
    colorText: 'text-[#8177d9]',
    colorBorder: 'border-[#8177d9]',
    items: [
      {
        code: 'APP-01',
        tag: 'Complete',
        title: 'Account created',
        detail: 'Identity and login secured',
      },
      {
        code: 'APP-02',
        tag: 'Complete',
        title: 'Business profile',
        detail: 'Revenue and founding date added',
      },
    ],
  },
  {
    title: 'Data connection',
    count: 2,
    colorText: 'text-[#b87c18]',
    colorBorder: 'border-[#e5a029]',
    items: [
      {
        code: 'DATA-01',
        tag: 'Next',
        title: 'Connect business checking',
        detail: 'Balances and transaction history',
      },
      {
        code: 'DATA-02',
        tag: 'Optional',
        title: 'Connect accounting',
        detail: 'QuickBooks, Xero, FreshBooks',
      },
    ],
  },
  {
    title: 'Underwriting',
    count: 2,
    colorText: 'text-[#c45586]',
    colorBorder: 'border-[#d86b9b]',
    items: [
      {
        code: 'REV-01',
        tag: 'Waiting',
        title: 'Cash-flow analysis',
        detail: 'Starts after data connection',
      },
      {
        code: 'REV-02',
        tag: 'Waiting',
        title: 'Business verification',
        detail: 'Automated eligibility review',
      },
    ],
  },
  {
    title: 'Decision',
    count: 1,
    colorText: 'text-[#368a63]',
    colorBorder: 'border-[#46a97b]',
    items: [
      {
        code: 'DEC-01',
        tag: 'Pending',
        title: 'Financing options',
        detail: 'Available after review',
      },
    ],
  },
]

const sections = {
  overview: {
    title: 'Financing overview',
    description: 'Track your application, monitor readiness, and see what CreditDibe needs next.',
  },
  application: {
    title: 'Application details',
    description: 'Review each financing step and see what is complete, next, or waiting.',
  },
  'cash-flow': {
    title: 'Cash-flow analysis',
    description: 'Review the projected cash-flow signal used to assess financing readiness.',
  },
  'data-connections': {
    title: 'Data connections',
    description: 'Connect financial accounts to complete automated underwriting.',
  },
  profile: {
    title: 'Business profile',
    description: 'Review the business information attached to this financing application.',
  },
  'help-center': {
    title: 'Help center',
    description: 'Find answers about your application, financial connections, and next steps.',
  },
} as const

type SectionKey = keyof typeof sections

function MiniBars() {
  return (
    <div className="flex h-8 items-end gap-1">
      {['h-[6px]', 'h-[12px]', 'h-[9px]', 'h-[18px]', 'h-[15px]', 'h-[24px]', 'h-[21px]'].map(
        (height, index) => (
          <i
            key={index}
            className={`w-1.5 rounded-t-sm ${height} ${index > 4 ? 'bg-[#91a98b]' : 'bg-[#e4e5e2]'}`}
          />
        ),
      )}
    </div>
  )
}

function CashFlowChart({ large = false }: { large?: boolean }) {
  return (
    <svg
      viewBox="0 0 480 180"
      preserveAspectRatio="none"
      className={`mt-3 w-full ${large ? 'h-[260px]' : 'h-[150px]'}`}
      aria-label="Projected cash flow awaiting connected data"
    >
      <path d="M0 25H480M0 65H480M0 105H480M0 145H480" stroke="#ececed" strokeDasharray="3 4" />
      <path
        d="M0 35H65V48H120V55H175V72H245V92H300V118H365V132H430V150H480"
        fill="none"
        stroke="#8177d9"
        strokeWidth="2"
      />
      <path
        d="M0 42H70V50H145V43H210V69H275V84H345V85H410V105H458V154H480"
        fill="none"
        stroke="#91a98b"
        strokeWidth="2"
      />
      <text x="3" y="176" fontSize="8" fill="#9a9e9b">
        Now
      </text>
      <text x="438" y="176" fontSize="8" fill="#9a9e9b">
        Review
      </text>
    </svg>
  )
}

export default function DashboardWorkspace({
  firstName,
  initials,
  applicationRef,
  revenue,
  businessAge,
  establishedMonth,
}: WorkspaceProps) {
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'Board' | 'Summary' | 'Timeline'>('Board')
  const [activeSection, setActiveSection] = useState<SectionKey>('overview')

  useEffect(() => {
    const updateSection = () => {
      const hash = window.location.hash.slice(1)
      setActiveSection(hash in sections ? (hash as SectionKey) : 'overview')
    }

    updateSection()
    window.addEventListener('hashchange', updateSection)
    return () => window.removeEventListener('hashchange', updateSection)
  }, [])

  const filteredWorkflow = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return workflow
    return workflow.map((column) => ({
      ...column,
      items: column.items.filter((item) =>
        `${column.title} ${item.title} ${item.detail} ${item.tag}`
          .toLowerCase()
          .includes(normalized),
      ),
    }))
  }, [query])

  return (
    <div className="min-w-0 bg-white">
      <div className="flex min-h-[58px] items-center gap-4 border-b border-[#e8e8e8] px-4 md:px-6">
        <span className="text-lg text-[#656b68]">←</span>
        <div className="hidden items-center gap-2 text-[10px] text-[#818682] sm:flex">
          <span>▣</span>
          <span>Dashboard</span>
          <span>›</span>
          <b className="text-[#111a18]">{sections[activeSection].title}</b>
        </div>
        {activeSection === 'application' && (
          <label className="ml-auto flex h-8 w-full max-w-[260px] items-center gap-2 rounded-md bg-[#f7f7f8] px-3 text-[#898e8a]">
            <span className="text-xs">⌕</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search application"
              className="min-w-0 flex-1 bg-transparent text-[10px] outline-none"
            />
            <kbd className="hidden text-[8px] sm:block">⌘F</kbd>
          </label>
        )}
        <a
          href="#data-connections"
          className={`${activeSection === 'application' ? '' : 'ml-auto'} hidden text-[10px] font-medium sm:block`}
        >
          Connections
        </a>
        <a
          href="#application"
          className="rounded-md bg-[#111a18] px-4 py-2 text-[9px] font-semibold whitespace-nowrap text-white"
        >
          Continue
        </a>
      </div>

      <div className="px-4 py-6 md:px-6 lg:px-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-[22px] font-semibold tracking-[-.035em]">
              {sections[activeSection].title}
            </h1>
            <p className="mt-2 max-w-xl text-[10px] leading-4 text-[#727773]">
              {sections[activeSection].description}
            </p>
          </div>
          <div className="flex items-center">
            {[
              [initials, 'bg-[#dce9d6]'],
              ['CD', 'bg-[#f2d6a2]'],
              ['AI', 'bg-[#ded9f6]'],
            ].map(([label, color]) => (
              <span
                key={label}
                className={`-ml-1 grid h-7 w-7 place-items-center rounded-full border-2 border-white text-[7px] font-bold ${color}`}
              >
                {label}
              </span>
            ))}
            <span className="ml-1 text-xs text-[#767b78]">+</span>
          </div>
        </div>

        {activeSection === 'overview' && (
          <section id="overview" className="mt-7 grid gap-3 lg:grid-cols-[1.05fr_.72fr_1.5fr]">
            <article className="rounded-md border border-[#ececed] p-4 shadow-[0_1px_5px_rgba(20,25,23,.03)]">
              <div className="flex items-center justify-between">
                <b className="text-[10px]">▤ Application status</b>
                <span className="text-sm text-[#979b98]">⋮</span>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div>
                  <strong className="text-[23px]">50%</strong>
                  <small className="block text-[8px] text-[#747976]">Readiness</small>
                </div>
                <div>
                  <strong className="text-[23px]">2</strong>
                  <small className="block text-[8px] text-[#747976]">Complete</small>
                </div>
                <div>
                  <strong className="text-[23px]">2</strong>
                  <small className="block text-[8px] text-[#747976]">Remaining</small>
                </div>
              </div>
              <div className="mt-6 h-11 overflow-hidden rounded-sm bg-[linear-gradient(90deg,#6961ce_0%,#8e83e6_44%,#c39be9_72%,#ccff52_100%)]">
                <div className="flex h-full gap-[3px] opacity-30">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <i key={index} className="w-px bg-white" />
                  ))}
                </div>
              </div>
              <div className="mt-2 flex justify-between text-[7px] text-[#8c908d]">
                <span>Account created</span>
                <span>Decision</span>
              </div>
            </article>

            <div className="grid gap-3">
              <article className="rounded-md border border-[#ececed] p-4">
                <div className="flex justify-between">
                  <b className="text-[10px]">Monthly revenue</b>
                  <span className="text-[#969a97]">⋮</span>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <strong className="text-[20px]">
                      {revenue === 'Not available' ? revenue : `$${revenue}`}
                    </strong>
                    <small className="mt-1 block text-[8px] text-[#6e9d63]">
                      Applicant reported
                    </small>
                  </div>
                  <MiniBars />
                </div>
              </article>
              <article className="rounded-md border border-[#ececed] p-4">
                <div className="flex justify-between">
                  <b className="text-[10px]">Time in business</b>
                  <span className="text-[#969a97]">⋮</span>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <strong className="text-[20px]">{businessAge}</strong>
                    <small className="mt-1 block text-[8px] text-[#787d79]">
                      Since {establishedMonth}
                    </small>
                  </div>
                  <span className="text-2xl text-[#91a98b]">⌁</span>
                </div>
              </article>
            </div>

            <article className="rounded-md border border-[#ececed] p-4">
              <div className="flex items-center justify-between">
                <b className="inline-flex items-center gap-1.5 text-[10px]">
                  <i className="h-1.5 w-1.5 rounded-full bg-[#8177d9]" />
                  Cash-flow signal <span className="font-normal text-[#8a8f8b]">(projected)</span>
                </b>
                <span className="text-sm text-[#979b98]">⋮</span>
              </div>
              <CashFlowChart />
            </article>
          </section>
        )}

        {activeSection === 'application' && (
          <div id="application" className="mt-7">
            <div className="flex flex-col justify-between gap-3 border-b border-[#ececed] sm:flex-row sm:items-center">
              <div className="flex gap-1">
                {(['Board', 'Summary', 'Timeline'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setView(item)}
                    className={`rounded-t-md px-3 py-2 text-[9px] ${view === item ? 'bg-[#f4f4f5] font-semibold text-[#111a18]' : 'text-[#6f7471]'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="flex gap-4 pb-2 text-[9px] text-[#575c59]">
                <span>7 application steps</span>
                <span>2 complete</span>
              </div>
            </div>

            {view === 'Board' && (
              <section className="grid gap-px overflow-x-auto lg:grid-cols-4">
                {filteredWorkflow.map((column) => (
                  <div
                    key={column.title}
                    className="min-w-[220px] border-r border-[#efefef] px-3 py-5 last:border-r-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full border-2 ${column.colorBorder}`} />
                      <b className="text-[10px]">{column.title}</b>
                      <span className="text-[9px] text-[#777c79]">
                        {column.items.length}/{column.count}
                      </span>
                      <span className="ml-auto text-[#949895]">⋮</span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {column.items.map((item, index) => (
                        <article
                          key={item.code}
                          className={`rounded-md border bg-white p-3.5 shadow-[0_3px_12px_rgba(20,25,23,.04)] ${
                            column.title === 'Data connection' && index === 0
                              ? 'rotate-[1deg] border-dashed border-[#cfcfd2]'
                              : 'border-[#ededee]'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[8px] text-[#898e8a]">
                            <span>↗ {item.code}</span>
                            <span className={`inline-flex items-center gap-1 ${column.colorText}`}>
                              <i className="h-1.5 w-1.5 rounded-full bg-current" />
                              {item.tag}
                            </span>
                          </div>
                          <h3 className="mt-4 text-[11px] font-semibold">{item.title}</h3>
                          <p className="mt-1 text-[8px] leading-4 text-[#858a87]">
                            ⌁ {item.detail}
                          </p>
                          <div className="mt-5 flex items-center justify-between border-t border-[#f0f0f0] pt-3">
                            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#edf2ea] text-[6px] font-bold">
                              {initials}
                            </span>
                            <span className="text-[8px] text-[#858a87]">
                              {index === 0 ? 'Updated today' : 'Up next'}
                            </span>
                          </div>
                        </article>
                      ))}
                      {column.items.length === 0 && (
                        <div className="rounded-md border border-dashed border-[#d9d9dc] p-5 text-center text-[9px] text-[#8a8f8c]">
                          No matching items
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {view === 'Summary' && (
              <section className="grid gap-3 py-5 sm:grid-cols-2 lg:grid-cols-4">
                {workflow.map((column) => (
                  <article key={column.title} className="rounded-md border border-[#ececed] p-4">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full border-2 ${column.colorBorder}`} />
                      <b className="text-[10px]">{column.title}</b>
                    </div>
                    <strong className="mt-5 block text-[24px]">
                      {column.items.length}/{column.count}
                    </strong>
                    <span className="text-[8px] text-[#7d827f]">steps visible</span>
                    <div className="mt-4 h-1.5 overflow-hidden rounded bg-[#ececed]">
                      <i
                        className={`block h-full ${column.title === 'Application' ? 'w-full bg-[#8177d9]' : 'w-0'}`}
                      />
                    </div>
                  </article>
                ))}
              </section>
            )}

            {view === 'Timeline' && (
              <section className="py-5">
                <div className="relative ml-3 border-l border-[#dcdcdf] pl-6">
                  {workflow
                    .flatMap((column) => column.items)
                    .map((item, index) => (
                      <article
                        key={item.code}
                        className="relative border-b border-[#eeeeef] py-4 first:pt-0"
                      >
                        <i
                          className={`absolute -left-[29px] top-4 h-2 w-2 rounded-full ${index < 2 ? 'bg-[#91a98b]' : 'bg-[#d7d7da]'}`}
                        />
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <b className="text-[10px]">{item.title}</b>
                            <p className="mt-1 text-[8px] text-[#818683]">{item.detail}</p>
                          </div>
                          <span className="text-[8px] text-[#858a87]">
                            {index < 2 ? 'Complete' : index === 2 ? 'Next' : 'Pending'}
                          </span>
                        </div>
                      </article>
                    ))}
                </div>
              </section>
            )}
          </div>
        )}

        {activeSection === 'cash-flow' && (
          <section id="cash-flow" className="mt-7 grid gap-3 lg:grid-cols-[1.5fr_.65fr]">
            <article className="rounded-md border border-[#ececed] p-5">
              <div className="flex items-center justify-between">
                <b className="inline-flex items-center gap-1.5 text-[11px]">
                  <i className="h-1.5 w-1.5 rounded-full bg-[#8177d9]" />
                  Projected cash-flow signal
                </b>
                <span className="rounded bg-[#f1f1f2] px-2 py-1 text-[8px] text-[#717673]">
                  Awaiting data
                </span>
              </div>
              <CashFlowChart large />
              <div className="flex gap-5 border-t border-[#eeeeef] pt-3 text-[8px] text-[#777c79]">
                <span className="inline-flex items-center gap-1.5">
                  <i className="h-1.5 w-1.5 rounded-full bg-[#8177d9]" />
                  Projected inflow
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="h-1.5 w-1.5 rounded-full bg-[#91a98b]" />
                  Projected balance
                </span>
              </div>
            </article>
            <div className="grid gap-3">
              <article className="rounded-md border border-[#ececed] p-4">
                <span className="text-[8px] text-[#858a87]">MONTHLY REVENUE</span>
                <strong className="mt-3 block text-[22px]">
                  {revenue === 'Not available' ? revenue : `$${revenue}`}
                </strong>
                <p className="mt-1 text-[8px] text-[#777c79]">Applicant reported</p>
              </article>
              <article className="rounded-md border border-[#ececed] p-4">
                <span className="text-[8px] text-[#858a87]">NEXT STEP</span>
                <b className="mt-3 block text-[11px]">Connect business checking</b>
                <p className="mt-2 text-[8px] leading-4 text-[#777c79]">
                  Transaction data will replace projections with an underwriting-ready analysis.
                </p>
                <a
                  href="#data-connections"
                  className="mt-4 inline-block rounded bg-[#111a18] px-3 py-2 text-[8px] font-semibold text-white"
                >
                  Connect data
                </a>
              </article>
            </div>
          </section>
        )}

        {activeSection === 'data-connections' && (
          <section id="data-connections" className="mt-7 grid gap-3 sm:grid-cols-2">
            <article className="rounded-md border border-[#ececed] p-5">
              <span className="text-[8px] text-[#8b8f8c]">BUSINESS BANK</span>
              <div className="mt-3 flex items-center justify-between">
                <b className="text-[11px]">Checking account</b>
                <span className="rounded bg-[#f3eee2] px-2 py-1 text-[7px] text-[#9a7024]">
                  Not connected
                </span>
              </div>
              <p className="mt-4 text-[9px] leading-4 text-[#777c79]">
                Securely share balances and transaction history for cash-flow underwriting.
              </p>
              <span className="mt-5 block text-[8px] font-medium text-[#9a7024]">
                Connection setup is the next application step
              </span>
            </article>
            <article className="rounded-md border border-[#ececed] p-5">
              <span className="text-[8px] text-[#8b8f8c]">ACCOUNTING</span>
              <div className="mt-3 flex items-center justify-between">
                <b className="text-[11px]">QuickBooks, Xero or FreshBooks</b>
                <span className="rounded bg-[#f1f1f2] px-2 py-1 text-[7px] text-[#757a77]">
                  Optional
                </span>
              </div>
              <p className="mt-4 text-[9px] leading-4 text-[#777c79]">
                Add accounting data to provide more detail about business performance.
              </p>
              <span className="mt-5 block text-[8px] font-medium text-[#757a77]">
                Available after business bank connection
              </span>
            </article>
          </section>
        )}

        {activeSection === 'profile' && (
          <section id="profile" className="mt-7 grid gap-3 sm:grid-cols-2">
            <article className="rounded-md border border-[#ececed] p-5">
              <span className="text-[8px] text-[#858a87]">APPLICATION</span>
              <b className="mt-2 block text-[13px]">#{applicationRef}</b>
              <dl className="mt-5 space-y-3 border-t border-[#eeeeef] pt-4 text-[9px]">
                <div className="flex justify-between gap-4">
                  <dt className="text-[#7e837f]">Applicant</dt>
                  <dd className="font-medium">{firstName}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#7e837f]">Status</dt>
                  <dd className="font-medium">In progress</dd>
                </div>
              </dl>
            </article>
            <article className="rounded-md border border-[#ececed] p-5">
              <span className="text-[8px] text-[#858a87]">BUSINESS DETAILS</span>
              <dl className="mt-5 space-y-3 text-[9px]">
                <div className="flex justify-between gap-4">
                  <dt className="text-[#7e837f]">Established</dt>
                  <dd className="font-medium">{establishedMonth}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#7e837f]">Time in business</dt>
                  <dd className="font-medium">{businessAge}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#7e837f]">Monthly revenue</dt>
                  <dd className="font-medium">
                    {revenue === 'Not available' ? revenue : `$${revenue}`}
                  </dd>
                </div>
              </dl>
              <a href="#application" className="mt-5 inline-block text-[9px] font-semibold">
                View application details →
              </a>
            </article>
          </section>
        )}

        {activeSection === 'help-center' && (
          <section id="help-center" className="mt-7 grid gap-5 lg:grid-cols-[1.4fr_.6fr]">
            <div>
              <h2 className="text-[12px] font-semibold">Frequently asked questions</h2>
              <div className="mt-3 divide-y divide-[#ececed] rounded-md border border-[#ececed]">
                {[
                  {
                    question: 'What do I need to complete my application?',
                    answer:
                      'Complete your business profile and connect a business checking account. Accounting data is optional but may provide more context during review.',
                  },
                  {
                    question: 'Why does CreditDibe need financial data?',
                    answer:
                      'Transaction data helps assess cash flow and financing readiness. Your dashboard will show when the required connection step is complete.',
                  },
                  {
                    question: 'When will I receive a financing decision?',
                    answer:
                      'Underwriting starts after the required application and data-connection steps are complete. You can follow each stage from Application details.',
                  },
                  {
                    question: 'Can I explore repayment options before a decision?',
                    answer:
                      'Yes. The Repayment Lab lets you compare sample payment structures while your application is still in progress.',
                  },
                ].map((item) => (
                  <article key={item.question} className="p-5">
                    <h3 className="text-[10px] font-semibold">{item.question}</h3>
                    <p className="mt-2 text-[9px] leading-4 text-[#737875]">{item.answer}</p>
                  </article>
                ))}
              </div>
            </div>

            <aside className="rounded-md bg-[#f7f7f8] p-5">
              <span className="text-[8px] font-medium text-[#858a87]">QUICK LINKS</span>
              <div className="mt-4 space-y-2">
                {[
                  ['Review application', '#application'],
                  ['Manage data connections', '#data-connections'],
                  ['Open repayment lab', '/repayment-lab'],
                ].map(([label, href]) => (
                  <a
                    key={href}
                    href={href}
                    className="flex items-center justify-between rounded-md border border-[#e5e5e7] bg-white px-3 py-3 text-[9px] font-medium hover:border-[#c9c9cc]"
                  >
                    {label}
                    <span aria-hidden="true">→</span>
                  </a>
                ))}
              </div>
              <div className="mt-5 border-t border-[#e2e2e4] pt-5">
                <b className="text-[10px]">Application #{applicationRef}</b>
                <p className="mt-2 text-[8px] leading-4 text-[#767b78]">
                  Keep this reference available when discussing your financing application.
                </p>
              </div>
            </aside>
          </section>
        )}
      </div>
    </div>
  )
}
