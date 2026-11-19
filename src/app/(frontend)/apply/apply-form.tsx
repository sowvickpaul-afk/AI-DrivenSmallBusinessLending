'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

function Logo() {
  return (
    <a
      href="/"
      className="flex items-end gap-2 text-xl font-bold tracking-[-0.04em]"
      aria-label="CreditDibe home"
    >
      <span className="flex h-7 items-end gap-0.5 skew-x-[-8deg]" aria-hidden="true">
        <i className="h-3 w-1.5 bg-[#111a18]" />
        <i className="h-5 w-1.5 bg-[#111a18]" />
        <i className="h-7 w-1.5 bg-[#91a98b]" />
      </span>
      Credit<span className="text-[#70826d]">Dibe</span>
    </a>
  )
}

function EyeIcon({ crossed = false }: { crossed?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path
        d="M2.8 12s3.35-5 9.2-5 9.2 5 9.2 5-3.35 5-9.2 5-9.2-5-9.2-5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="2.25" stroke="currentColor" strokeWidth="1.5" />
      {crossed && <path d="m4 4 16 16" stroke="currentColor" strokeWidth="1.5" />}
    </svg>
  )
}

export default function ApplyForm({ maxEstablishedMonth }: { maxEstablishedMonth: string }) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showReferral, setShowReferral] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    const form = new FormData(event.currentTarget)

    try {
      const response = await fetch('/apply/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.get('firstName'),
          lastName: form.get('lastName'),
          email: form.get('email'),
          password: form.get('password'),
          averageMonthlyRevenue: Number(form.get('averageMonthlyRevenue')),
          establishedMonth: form.get('establishedMonth'),
          referralCode: form.get('referralCode'),
        }),
      })
      const result = (await response.json()) as { error?: string }
      if (!response.ok) throw new Error(result.error || 'Unable to create your account.')
      router.push('/dashboard')
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to create your account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f1e8] text-[#111a18]">
      <header className="flex h-20 items-center px-6 md:px-[5.5vw]">
        <Logo />
      </header>

      <div className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-[.92fr_1.08fr]">
        <section className="flex flex-col px-6 pt-10 pb-16 md:px-[6vw] lg:pt-14">
          <span className="font-mono text-[9px] font-medium tracking-[.16em] text-[#6d8069]">
            BUSINESS FINANCING / APPLICATION
          </span>
          <h1 className="mt-7 max-w-[600px] text-[45px] leading-[1.08] font-medium tracking-[-.055em] md:text-[62px]">
            Ready to apply for{' '}
            <em className="font-serif font-medium text-[#6b8966]">business financing?</em>
          </h1>
          <p className="mt-7 text-lg font-medium">Great, you&apos;re in the right place.</p>
          <ul className="mt-8 space-y-5 text-sm md:text-base">
            {[
              'Registering is fast and free',
              'Get a decision quickly with no obligation',
              'Applying will not affect your credit score',
            ].map((benefit) => (
              <li key={benefit} className="flex items-center gap-4">
                <span className="h-2.5 w-2.5 rounded-full bg-[#91a98b]" />
                {benefit}
              </li>
            ))}
          </ul>

          <div className="mt-14 hidden max-w-sm border-t border-[#111a18]/15 pt-7 lg:block">
            <span className="font-mono text-[8px] tracking-[.12em] text-[#747b77]">
              YOUR INFORMATION IS PROTECTED
            </span>
            <p className="mt-3 text-[11px] leading-5 text-[#69706c]">
              We use encrypted connections and only request information needed to evaluate your
              business application.
            </p>
          </div>
        </section>

        <section className="bg-[#e6e3da] px-4 py-8 md:px-10 md:py-12 lg:px-[5vw]">
          <form
            onSubmit={submit}
            className="mx-auto max-w-[650px] bg-[#faf8f1] p-6 shadow-[0_20px_55px_rgba(17,26,24,.1)] md:p-12"
          >
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="sr-only" htmlFor="firstName">
                First name
              </label>
              <input
                className="h-16 bg-[#f0f1ec] px-5 text-sm outline-none transition focus:bg-white focus:ring-1 focus:ring-[#6b8966]"
                id="firstName"
                name="firstName"
                placeholder="First name"
                autoComplete="given-name"
                required
                maxLength={80}
              />
              <label className="sr-only" htmlFor="lastName">
                Last name
              </label>
              <input
                className="h-16 bg-[#f0f1ec] px-5 text-sm outline-none transition focus:bg-white focus:ring-1 focus:ring-[#6b8966]"
                id="lastName"
                name="lastName"
                placeholder="Last name"
                autoComplete="family-name"
                required
                maxLength={80}
              />
            </div>

            <label className="sr-only" htmlFor="email">
              Email
            </label>
            <input
              className="mt-3 h-16 w-full bg-[#f0f1ec] px-5 text-sm outline-none transition focus:bg-white focus:ring-1 focus:ring-[#6b8966]"
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              required
            />

            <div className="relative mt-3">
              <label className="sr-only" htmlFor="password">
                Choose a password
              </label>
              <input
                className="h-16 w-full bg-[#f0f1ec] px-5 pr-14 text-sm outline-none transition focus:bg-white focus:ring-1 focus:ring-[#6b8966]"
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Choose a password"
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
                required
              />
              <button
                className="absolute top-0 right-0 grid h-16 w-14 place-items-center text-[#6b8966]"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <EyeIcon crossed={showPassword} />
              </button>
            </div>

            <div className="my-6 border-t border-[#111a18]/15" />

            <label className="sr-only" htmlFor="averageMonthlyRevenue">
              Average monthly revenue
            </label>
            <input
              className="h-16 w-full bg-[#f0f1ec] px-5 text-sm outline-none transition focus:bg-white focus:ring-1 focus:ring-[#6b8966]"
              id="averageMonthlyRevenue"
              name="averageMonthlyRevenue"
              type="number"
              min="0"
              max="100000000"
              step="100"
              placeholder="Average monthly revenue (last 3 months)"
              required
            />

            <label className="sr-only" htmlFor="establishedMonth">
              Date established
            </label>
            <input
              className="mt-3 h-16 w-full bg-[#f0f1ec] px-5 text-sm outline-none transition focus:bg-white focus:ring-1 focus:ring-[#6b8966]"
              id="establishedMonth"
              name="establishedMonth"
              type="month"
              max={maxEstablishedMonth}
              aria-describedby="establishedMonthHint"
              required
            />
            <p id="establishedMonthHint" className="mt-2 text-[9px] text-[#737a76]">
              Select the month and year your business was founded. Future dates are not accepted.
            </p>

            <button
              className="mt-5 flex items-center gap-3 text-xs font-bold"
              type="button"
              onClick={() => setShowReferral(!showReferral)}
              aria-expanded={showReferral}
            >
              Have a referral code?
              <span className={`text-lg transition-transform ${showReferral ? 'rotate-180' : ''}`}>
                ⌄
              </span>
            </button>
            {showReferral && (
              <>
                <label className="sr-only" htmlFor="referralCode">
                  Referral code
                </label>
                <input
                  className="mt-3 h-14 w-full bg-[#f0f1ec] px-5 text-sm outline-none transition focus:bg-white focus:ring-1 focus:ring-[#6b8966]"
                  id="referralCode"
                  name="referralCode"
                  placeholder="Referral code"
                  maxLength={60}
                />
              </>
            )}

            <p className="mt-6 text-center text-[10px] leading-5 text-[#6d7470]">
              By signing up I am creating a CreditDibe account and agreeing to the{' '}
              <a className="underline underline-offset-2" href="/terms">
                Terms of Use
              </a>{' '}
              and{' '}
              <a className="underline underline-offset-2" href="/privacy">
                Privacy Policy
              </a>
              .
            </p>

            {error && (
              <div
                className="mt-4 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-[11px] text-red-800"
                role="alert"
              >
                {error}
              </div>
            )}

            <button
              className="mt-6 flex h-16 w-full items-center justify-center gap-4 bg-[#111a18] text-sm font-bold text-white transition hover:bg-[#293632] disabled:cursor-wait disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating your account…' : 'Create account'}
              {!loading && <span className="text-[#ccff52]">→</span>}
            </button>

            <p className="mt-7 text-center text-sm">
              Already have an account?{' '}
              <a
                className="font-bold underline decoration-[#91a98b] underline-offset-4"
                href="/login"
              >
                Log in
              </a>
            </p>
          </form>
        </section>
      </div>
    </main>
  )
}
