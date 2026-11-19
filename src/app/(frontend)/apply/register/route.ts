import { appAuth } from '@/lib/app-auth'
import { normalizeFoundedMonth } from '@/lib/business-date'
import { getPayloadClient } from '@/lib/payload'

type SignupBody = {
  firstName?: unknown
  lastName?: unknown
  email?: unknown
  password?: unknown
  averageMonthlyRevenue?: unknown
  establishedMonth?: unknown
  referralCode?: unknown
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
function cleanText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export async function POST(request: Request) {
  let body: SignupBody
  try {
    body = (await request.json()) as SignupBody
  } catch {
    return Response.json({ error: 'Please submit a valid application.' }, { status: 400 })
  }

  const firstName = cleanText(body.firstName, 80)
  const lastName = cleanText(body.lastName, 80)
  const email = cleanText(body.email, 254).toLowerCase()
  const password = typeof body.password === 'string' ? body.password : ''
  const establishedMonthResult = normalizeFoundedMonth(body.establishedMonth)
  const referralCode = cleanText(body.referralCode, 60)
  const averageMonthlyRevenue =
    typeof body.averageMonthlyRevenue === 'number' ? body.averageMonthlyRevenue : Number.NaN

  if (!firstName || !lastName) {
    return Response.json({ error: 'Enter your first and last name.' }, { status: 422 })
  }
  if (!emailPattern.test(email)) {
    return Response.json({ error: 'Enter a valid email address.' }, { status: 422 })
  }
  if (password.length < 8 || password.length > 128) {
    return Response.json(
      { error: 'Password must be between 8 and 128 characters.' },
      { status: 422 },
    )
  }
  if (
    !Number.isFinite(averageMonthlyRevenue) ||
    averageMonthlyRevenue < 0 ||
    averageMonthlyRevenue > 100000000
  ) {
    return Response.json({ error: 'Enter a valid average monthly revenue.' }, { status: 422 })
  }
  if (!establishedMonthResult.value) {
    return Response.json({ error: establishedMonthResult.error }, { status: 422 })
  }
  const establishedMonth = establishedMonthResult.value

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'users',
      data: {
        firstName,
        lastName,
        email,
        password,
        averageMonthlyRevenue,
        establishedMonth,
        referralCode: referralCode || undefined,
      },
      overrideAccess: false,
    })

    await appAuth.login(email, password)
    return Response.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : ''
    if (message.includes('email') || message.includes('unique')) {
      return Response.json(
        { error: 'An account already exists for this email. Try logging in.' },
        { status: 409 },
      )
    }
    return Response.json(
      { error: 'We could not create your account. Please review your details and try again.' },
      { status: 400 },
    )
  }
}
