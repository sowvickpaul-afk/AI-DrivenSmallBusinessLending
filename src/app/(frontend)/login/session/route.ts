import { appAuth } from '@/lib/app-auth'

export async function POST(request: Request) {
  let body: { email?: unknown; password?: unknown }
  try {
    body = (await request.json()) as { email?: unknown; password?: unknown }
  } catch {
    return Response.json({ error: 'Enter your email and password.' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body.password === 'string' ? body.password : ''

  if (!email || !password) {
    return Response.json({ error: 'Enter your email and password.' }, { status: 422 })
  }

  try {
    await appAuth.login(email, password)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Email or password is incorrect.' }, { status: 401 })
  }
}
