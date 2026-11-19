'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

export default function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    const form = new FormData(event.currentTarget)
    try {
      const response = await fetch('/login/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.get('email'), password: form.get('password') }),
      })
      const result = (await response.json()) as { error?: string }
      if (!response.ok) throw new Error(result.error || 'Unable to log in.')
      router.push('/dashboard')
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to log in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#e6e3da] p-5 text-[#111a18]">
      <section className="w-full max-w-lg bg-[#faf8f1] p-7 shadow-[0_20px_55px_rgba(17,26,24,.1)] md:p-12">
        <a href="/" className="text-xl font-bold tracking-[-.04em]">
          Credit<span className="text-[#70826d]">Dibe</span>
        </a>
        <span className="mt-12 block font-mono text-[9px] tracking-[.16em] text-[#6d8069]">
          WELCOME BACK
        </span>
        <h1 className="mt-4 text-4xl font-medium tracking-[-.05em]">Log in to your account.</h1>
        <form onSubmit={submit} className="mt-8">
          <label className="sr-only" htmlFor="login-email">
            Email
          </label>
          <input
            className="h-16 w-full bg-[#f0f1ec] px-5 text-sm outline-none focus:ring-1 focus:ring-[#6b8966]"
            id="login-email"
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            required
          />
          <div className="relative mt-3">
            <label className="sr-only" htmlFor="login-password">
              Password
            </label>
            <input
              className="h-16 w-full bg-[#f0f1ec] px-5 pr-14 text-sm outline-none focus:ring-1 focus:ring-[#6b8966]"
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="absolute top-0 right-0 h-16 w-14 text-xs font-bold text-[#6b8966]"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {error && (
            <div
              className="mt-4 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-[11px] text-red-800"
              role="alert"
            >
              {error}
            </div>
          )}
          <button
            className="mt-6 h-16 w-full bg-[#111a18] text-sm font-bold text-white transition hover:bg-[#293632] disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>
        <p className="mt-7 text-center text-sm">
          New to CreditDibe?{' '}
          <a className="font-bold underline decoration-[#91a98b] underline-offset-4" href="/apply">
            Apply now
          </a>
        </p>
      </section>
    </main>
  )
}
