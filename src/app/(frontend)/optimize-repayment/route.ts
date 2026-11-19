import { optimizeRepayment, type RepaymentInput } from '@/lib/repayment-agent'

const MAX_AMOUNT = 10_000_000

function finiteNumber(value: unknown, minimum: number, maximum: number) {
  return typeof value === 'number' && Number.isFinite(value) && value >= minimum && value <= maximum
}

function validateMonths(value: unknown) {
  return (
    Array.isArray(value) &&
    value.length === 12 &&
    value.every((month) => finiteNumber(month, 0, MAX_AMOUNT))
  )
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Request body must be valid JSON.' }, { status: 400 })
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return Response.json({ error: 'A repayment scenario is required.' }, { status: 400 })
  }

  const candidate = body as Record<string, unknown>
  const valid =
    finiteNumber(candidate.principal, 1_000, MAX_AMOUNT) &&
    finiteNumber(candidate.annualRate, 0, 60) &&
    finiteNumber(candidate.termMonths, 6, 60) &&
    Number.isInteger(candidate.termMonths) &&
    finiteNumber(candidate.startingCash, 0, MAX_AMOUNT) &&
    finiteNumber(candidate.reserveTarget, 1_000, MAX_AMOUNT) &&
    validateMonths(candidate.revenues) &&
    validateMonths(candidate.expenses)

  if (!valid) {
    return Response.json(
      {
        error:
          'Check the scenario values. Terms must be 6–60 months, APR 0–60%, and all 12 monthly cash-flow values must be non-negative.',
      },
      { status: 422 },
    )
  }

  const input: RepaymentInput = {
    principal: candidate.principal as number,
    annualRate: candidate.annualRate as number,
    termMonths: candidate.termMonths as number,
    startingCash: candidate.startingCash as number,
    reserveTarget: candidate.reserveTarget as number,
    revenues: [...(candidate.revenues as number[])],
    expenses: [...(candidate.expenses as number[])],
  }

  return Response.json(optimizeRepayment(input))
}
