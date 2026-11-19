'use client'

import { useMemo, useState } from 'react'
import type { RepaymentResult } from '@/lib/repayment-agent'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const initialRevenue = [
  42000, 39000, 44000, 52000, 68000, 81000, 88000, 83000, 70000, 59000, 49000, 76000,
]
const initialExpenses = [
  33000, 32500, 35000, 39000, 45000, 49000, 52000, 50000, 45000, 41000, 37000, 47000,
]

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export default function RepaymentLab() {
  const [principal, setPrincipal] = useState(120000)
  const [annualRate, setAnnualRate] = useState(12.5)
  const [termMonths, setTermMonths] = useState(24)
  const [startingCash, setStartingCash] = useState(55000)
  const [reserveTarget, setReserveTarget] = useState(30000)
  const [revenues, setRevenues] = useState(initialRevenue)
  const [expenses, setExpenses] = useState(initialExpenses)
  const [result, setResult] = useState<RepaymentResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const maxFlow = useMemo(() => Math.max(...revenues, ...expenses, 1), [revenues, expenses])

  const updateMonth = (source: 'revenue' | 'expense', index: number, value: number) => {
    const setter = source === 'revenue' ? setRevenues : setExpenses
    setter((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? Math.max(0, value) : item)),
    )
  }

  const optimize = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/optimize-repayment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          principal,
          annualRate,
          termMonths,
          startingCash,
          reserveTarget,
          revenues,
          expenses,
        }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Unable to optimize this scenario.')
      setResult(payload)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to optimize this scenario.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f1e8] text-[#111a18]">
      <header className="flex h-20 items-center justify-between border-b border-[#111a18]/15 px-5 md:px-[5vw]">
        <a href="/" className="flex items-end gap-2 text-xl font-bold tracking-[-0.04em]">
          <span className="flex h-7 items-end gap-0.5 skew-x-[-8deg]" aria-hidden="true">
            <i className="h-3 w-1.5 bg-[#111a18]" />
            <i className="h-5 w-1.5 bg-[#111a18]" />
            <i className="h-7 w-1.5 bg-[#91a98b]" />
          </span>
          Credit<span className="text-[#70826d]">Dibe</span>
        </a>
        <div className="hidden items-center gap-3 md:flex">
          <span className="font-mono text-[9px] tracking-[.16em] text-[#6d8069]">
            POLICY SIMULATOR / BETA
          </span>
          <a
            href="/"
            className="border border-[#111a18] px-5 py-3 text-xs font-bold transition hover:bg-[#111a18] hover:text-white"
          >
            Back to platform
          </a>
        </div>
      </header>

      <section className="grid border-b border-[#111a18]/15 lg:grid-cols-[.85fr_1.15fr]">
        <div className="px-6 py-16 md:px-[7.5vw] md:py-24">
          <span className="font-mono text-[9px] font-medium tracking-[.16em] text-[#6d8069]">
            REPAYMENT INTELLIGENCE
          </span>
          <h1 className="mt-7 max-w-3xl text-5xl leading-[.97] font-semibold tracking-[-.06em] md:text-7xl">
            Match repayment to the{' '}
            <em className="font-serif font-medium text-[#6b8966]">rhythm of revenue.</em>
          </h1>
          <p className="mt-7 max-w-xl text-sm leading-7 text-[#555d59]">
            This agent trains against thousands of seasonal cash-flow scenarios, then recommends
            when to preserve liquidity and when to accelerate principal.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {['Season-aware', 'Reserve constrained', 'Explainable schedule'].map((label) => (
              <span
                key={label}
                className="border border-[#111a18]/20 bg-[#faf8f1] px-3 py-2 font-mono text-[8px] tracking-[.08em]"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="relative min-h-96 overflow-hidden bg-[#19221f] p-8 text-white md:p-14">
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="relative mx-auto max-w-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[8px] tracking-[.15em] text-[#a0aaa5]">
                  SEASONAL CASH FLOW
                </span>
                <b className="mt-2 block text-2xl">12-month signal map</b>
              </div>
              <span className="flex items-center gap-2 text-[9px] text-[#ccff52]">
                <i className="h-2 w-2 rounded-full bg-[#ccff52]" /> LIVE INPUT
              </span>
            </div>
            <div className="mt-12 flex h-56 items-end gap-2">
              {revenues.map((revenue, index) => (
                <div key={MONTHS[index]} className="flex h-full flex-1 flex-col justify-end gap-1">
                  <div className="relative flex-1">
                    <i
                      className="absolute right-0 bottom-0 left-0 bg-[#91a98b]/40"
                      style={{ height: `${(revenue / maxFlow) * 100}%` }}
                    />
                    <i
                      className="absolute right-[24%] bottom-0 left-[24%] bg-[#ccff52]"
                      style={{ height: `${(expenses[index] / maxFlow) * 100}%` }}
                    />
                  </div>
                  <span className="text-center font-mono text-[7px] text-[#8d9792]">
                    {MONTHS[index]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-5 font-mono text-[8px] text-[#9ba49f]">
              <span>
                <i className="mr-2 inline-block h-2 w-2 bg-[#91a98b]" />
                Revenue
              </span>
              <span>
                <i className="mr-2 inline-block h-2 w-2 bg-[#ccff52]" />
                Operating cost
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-[420px_1fr]">
        <aside className="border-r border-[#111a18]/15 bg-[#e6e3da] p-6 md:p-10">
          <div className="sticky top-6">
            <span className="font-mono text-[9px] tracking-[.16em] text-[#6d8069]">
              01 — LOAN PARAMETERS
            </span>
            <div className="mt-8 space-y-5">
              {[
                ['Principal', principal, setPrincipal, 1000, 10000000, 1000, '$'],
                ['Annual rate', annualRate, setAnnualRate, 0, 60, 0.1, '%'],
                ['Term', termMonths, setTermMonths, 6, 60, 1, ' months'],
                ['Starting cash', startingCash, setStartingCash, 0, 10000000, 1000, '$'],
                ['Reserve target', reserveTarget, setReserveTarget, 1000, 10000000, 1000, '$'],
              ].map(([label, value, setter, min, max, step, suffix]) => (
                <label key={label as string} className="block">
                  <span className="mb-2 flex justify-between text-[10px] font-bold">
                    <b>{label as string}</b>
                    <i className="font-mono font-normal not-italic text-[#66706b]">
                      {suffix === '$' ? money.format(value as number) : `${value}${suffix}`}
                    </i>
                  </span>
                  <input
                    className="h-1 w-full cursor-pointer accent-[#111a18]"
                    type="range"
                    value={value as number}
                    min={min as number}
                    max={max as number}
                    step={step as number}
                    onChange={(event) =>
                      (setter as (value: number) => void)(Number(event.target.value))
                    }
                  />
                </label>
              ))}
            </div>
            <button
              onClick={optimize}
              disabled={loading}
              className="mt-9 flex w-full items-center justify-between bg-[#111a18] px-5 py-4 text-xs font-bold text-white transition hover:bg-[#293632] disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? 'Training policy…' : 'Optimize schedule'}{' '}
              <span className="text-[#ccff52]">→</span>
            </button>
            {error && (
              <p className="mt-4 border-l-2 border-red-600 pl-3 text-[10px] leading-5 text-red-800">
                {error}
              </p>
            )}
            <p className="mt-5 text-[9px] leading-4 text-[#737a76]">
              Decision-support simulation only. Recommendations are not financial advice or an
              automatic change to loan terms.
            </p>
          </div>
        </aside>

        <div className="p-6 md:p-10 lg:p-14">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="font-mono text-[9px] tracking-[.16em] text-[#6d8069]">
                02 — SEASONAL PROFILE
              </span>
              <h2 className="mt-4 text-3xl font-medium tracking-[-.04em]">
                Monthly operating assumptions
              </h2>
            </div>
            <span className="max-w-xs text-[9px] leading-4 text-[#747b77]">
              Adjust expected revenue and operating costs. The 12-month pattern repeats for terms
              longer than one year.
            </span>
          </div>
          <div className="mt-8 grid gap-px overflow-hidden border border-[#c7c6bd] bg-[#c7c6bd] sm:grid-cols-2 xl:grid-cols-4">
            {MONTHS.map((month, index) => (
              <div key={month} className="bg-[#faf8f1] p-4">
                <b className="font-mono text-[9px] tracking-[.12em]">{month.toUpperCase()}</b>
                <label className="mt-4 block text-[8px] text-[#777f7a]">
                  REVENUE
                  <input
                    type="number"
                    min="0"
                    value={revenues[index]}
                    onChange={(event) => updateMonth('revenue', index, Number(event.target.value))}
                    className="mt-1 w-full border-b border-[#c7c6bd] bg-transparent py-2 text-sm font-semibold outline-none focus:border-[#111a18]"
                  />
                </label>
                <label className="mt-3 block text-[8px] text-[#777f7a]">
                  EXPENSES
                  <input
                    type="number"
                    min="0"
                    value={expenses[index]}
                    onChange={(event) => updateMonth('expense', index, Number(event.target.value))}
                    className="mt-1 w-full border-b border-[#c7c6bd] bg-transparent py-2 text-sm font-semibold outline-none focus:border-[#111a18]"
                  />
                </label>
              </div>
            ))}
          </div>

          {result ? (
            <section className="mt-14" aria-live="polite">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[9px] tracking-[.16em] text-[#6d8069]">
                    03 — LEARNED POLICY
                  </span>
                  <h2 className="mt-4 text-3xl font-medium tracking-[-.04em]">
                    Recommended repayment path
                  </h2>
                </div>
                <span className="rounded-full bg-[#dff8d4] px-4 py-2 text-[9px] font-bold">
                  {result.summary.policyConfidence}% policy confidence
                </span>
              </div>
              <div className="mt-7 grid gap-px bg-[#bcc0b8] sm:grid-cols-2 xl:grid-cols-4">
                {[
                  ['Interest saved', money.format(result.summary.interestSaved)],
                  ['Lowest cash', money.format(result.summary.lowestCash)],
                  ['Peak payment', money.format(result.summary.peakPayment)],
                  [
                    'Reserve protected',
                    `${result.summary.reserveProtectedMonths}/${result.schedule.length} mo.`,
                  ],
                ].map(([label, value]) => (
                  <div key={label} className="bg-[#19221f] p-5 text-white">
                    <span className="font-mono text-[7px] tracking-[.13em] text-[#8e9893]">
                      {label.toUpperCase()}
                    </span>
                    <b className="mt-2 block text-xl">{value}</b>
                  </div>
                ))}
              </div>
              <div className="mt-6 overflow-x-auto border border-[#c7c6bd]">
                <table className="w-full min-w-[760px] border-collapse text-left">
                  <thead className="bg-[#e6e3da] font-mono text-[8px] tracking-[.1em]">
                    <tr>
                      {[
                        'Month',
                        'Revenue',
                        'Expenses',
                        'Payment',
                        'Principal',
                        'End cash',
                        'Balance',
                        'Risk',
                      ].map((label) => (
                        <th key={label} className="px-4 py-3 font-medium">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map((row) => (
                      <tr key={row.month} className="border-t border-[#d4d2c9] text-[10px]">
                        <td className="px-4 py-3 font-bold">{row.label}</td>
                        <td className="px-4 py-3">{money.format(row.revenue)}</td>
                        <td className="px-4 py-3">{money.format(row.expenses)}</td>
                        <td className="px-4 py-3 font-bold">{money.format(row.payment)}</td>
                        <td className="px-4 py-3">{money.format(row.principalPaid)}</td>
                        <td className="px-4 py-3">{money.format(row.endingCash)}</td>
                        <td className="px-4 py-3">{money.format(row.remainingBalance)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-[7px] font-bold ${row.risk === 'low' ? 'bg-[#dff8d4] text-[#365732]' : row.risk === 'watch' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}
                          >
                            {row.risk.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-5 border border-[#c7c6bd] bg-[#faf8f1] p-5">
                <b className="text-[10px]">How this recommendation was learned</b>
                <p className="mt-2 text-[9px] leading-5 text-[#69706c]">
                  {result.methodology.algorithm}. The reward balances principal reduction against
                  interest, payment volatility, and reserve shortfalls across{' '}
                  {result.summary.trainingEpisodes.toLocaleString()} simulated episodes.
                </p>
              </div>
            </section>
          ) : (
            <div className="mt-14 grid min-h-64 place-items-center border border-dashed border-[#aeb1aa] bg-[#faf8f1]/50 p-8 text-center">
              <div>
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#ccff52] text-xl">
                  ↗
                </span>
                <b className="mt-5 block text-sm">Your learned schedule will appear here</b>
                <p className="mt-2 max-w-sm text-[10px] leading-5 text-[#777e7a]">
                  Set the cash-flow pattern, then run the optimizer to train a policy for this
                  specific business.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
