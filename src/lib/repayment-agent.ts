import 'server-only'

export type RepaymentInput = {
  principal: number
  annualRate: number
  termMonths: number
  startingCash: number
  reserveTarget: number
  revenues: number[]
  expenses: number[]
}

export type ScheduleRow = {
  month: number
  label: string
  revenue: number
  expenses: number
  openingCash: number
  payment: number
  principalPaid: number
  interestPaid: number
  endingCash: number
  remainingBalance: number
  risk: 'low' | 'watch' | 'high'
}

export type RepaymentResult = {
  schedule: ScheduleRow[]
  summary: {
    totalPaid: number
    totalInterest: number
    interestSaved: number
    peakPayment: number
    lowestCash: number
    payoffMonth: number
    reserveProtectedMonths: number
    policyConfidence: number
    trainingEpisodes: number
  }
  methodology: {
    algorithm: string
    objective: string
    constraints: string[]
  }
}

const ACTIONS = [0.55, 0.75, 1, 1.25, 1.55, 2]
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const EPISODES = 3200

function seededRandom(seed: number) {
  let value = seed >>> 0
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0
    return value / 4294967296
  }
}

function inputSeed(input: RepaymentInput) {
  return Math.round(
    input.principal +
      input.startingCash * 3 +
      input.revenues.reduce((sum, value, index) => sum + value * (index + 1), 0),
  )
}

function stateKey(month: number, cash: number, balance: number, input: RepaymentInput) {
  const cashRatio = cash / Math.max(1, input.reserveTarget)
  const cashBucket = cashRatio < 0.75 ? 0 : cashRatio < 1.1 ? 1 : cashRatio < 1.75 ? 2 : 3
  const balanceRatio = balance / input.principal
  const balanceBucket =
    balanceRatio > 0.75 ? 3 : balanceRatio > 0.45 ? 2 : balanceRatio > 0.15 ? 1 : 0
  return `${month % 12}:${cashBucket}:${balanceBucket}`
}

function requiredPayment(balance: number, monthlyRate: number, monthsLeft: number) {
  if (balance <= 0) return 0
  if (monthlyRate === 0) return balance / Math.max(1, monthsLeft)
  return (balance * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -Math.max(1, monthsLeft)))
}

function chooseAction(values: number[], epsilon: number, random: () => number) {
  if (random() < epsilon) return Math.floor(random() * ACTIONS.length)
  let best = 0
  for (let index = 1; index < values.length; index += 1) {
    if (values[index] > values[best]) best = index
  }
  return best
}

function standardInterest(input: RepaymentInput) {
  const rate = input.annualRate / 1200
  const payment = requiredPayment(input.principal, rate, input.termMonths)
  let balance = input.principal
  let interest = 0
  for (let month = 0; month < input.termMonths && balance > 0.01; month += 1) {
    const monthlyInterest = balance * rate
    interest += monthlyInterest
    balance -= Math.min(balance, Math.max(0, payment - monthlyInterest))
  }
  return interest
}

export function optimizeRepayment(input: RepaymentInput): RepaymentResult {
  const random = seededRandom(inputSeed(input))
  const q = new Map<string, number[]>()
  const monthlyRate = input.annualRate / 1200
  const getValues = (key: string) => {
    const existing = q.get(key)
    if (existing) return existing
    const values = ACTIONS.map(() => 0)
    q.set(key, values)
    return values
  }

  for (let episode = 0; episode < EPISODES; episode += 1) {
    let cash = input.startingCash
    let balance = input.principal
    let previousPayment = 0
    const epsilon = Math.max(0.04, 0.34 * (1 - episode / EPISODES))

    for (let month = 0; month < input.termMonths && balance > 0.01; month += 1) {
      const seasonalIndex = month % 12
      const revenueNoise = 0.88 + random() * 0.24
      const expenseNoise = 0.94 + random() * 0.12
      cash +=
        input.revenues[seasonalIndex] * revenueNoise - input.expenses[seasonalIndex] * expenseNoise

      const key = stateKey(seasonalIndex, cash, balance, input)
      const values = getValues(key)
      const action = chooseAction(values, epsilon, random)
      const interest = balance * monthlyRate
      const base = requiredPayment(balance, monthlyRate, input.termMonths - month)
      const desired = Math.min(balance + interest, base * ACTIONS[action])
      const reserveFloor = input.reserveTarget * 0.9
      const affordable = Math.max(interest, cash - reserveFloor)
      const payment = Math.max(0, Math.min(desired, affordable, balance + interest))
      const principalPaid = Math.min(balance, Math.max(0, payment - interest))
      cash -= payment
      balance -= principalPaid

      const reserveShortfall = Math.max(0, input.reserveTarget - cash)
      const volatility = Math.abs(payment - previousPayment)
      let reward =
        principalPaid * 0.018 - interest * 0.035 - reserveShortfall * 0.14 - volatility * 0.002
      if (cash < 0) reward -= Math.abs(cash) * 2
      if (month === input.termMonths - 1) reward -= balance * 0.7
      if (balance <= 0.01) reward += input.principal * 0.04

      const nextKey = stateKey((seasonalIndex + 1) % 12, cash, balance, input)
      const future = Math.max(...getValues(nextKey))
      values[action] += 0.11 * (reward + 0.94 * future - values[action])
      previousPayment = payment
    }
  }

  const schedule: ScheduleRow[] = []
  let cash = input.startingCash
  let balance = input.principal
  let totalInterest = 0
  let totalPaid = 0
  let peakPayment = 0
  let lowestCash = cash
  let protectedMonths = 0

  for (let month = 0; month < input.termMonths && balance > 0.01; month += 1) {
    const seasonalIndex = month % 12
    const openingCash = cash
    cash += input.revenues[seasonalIndex] - input.expenses[seasonalIndex]
    const values = getValues(stateKey(seasonalIndex, cash, balance, input))
    const action = chooseAction(values, 0, random)
    const interest = balance * monthlyRate
    const base = requiredPayment(balance, monthlyRate, input.termMonths - month)
    const desired = Math.min(balance + interest, base * ACTIONS[action])
    const affordable = Math.max(interest, cash - input.reserveTarget * 0.9)
    let payment = Math.max(0, Math.min(desired, affordable, balance + interest))

    if (month === input.termMonths - 1)
      payment = Math.min(balance + interest, Math.max(payment, cash - input.reserveTarget * 0.75))

    const principalPaid = Math.min(balance, Math.max(0, payment - interest))
    cash -= payment
    balance -= principalPaid
    totalInterest += interest
    totalPaid += payment
    peakPayment = Math.max(peakPayment, payment)
    lowestCash = Math.min(lowestCash, cash)
    if (cash >= input.reserveTarget) protectedMonths += 1

    const coverage = cash / input.reserveTarget
    schedule.push({
      month: month + 1,
      label: `${MONTHS[seasonalIndex]} ${Math.floor(month / 12) + 1}`,
      revenue: input.revenues[seasonalIndex],
      expenses: input.expenses[seasonalIndex],
      openingCash,
      payment,
      principalPaid,
      interestPaid: interest,
      endingCash: cash,
      remainingBalance: Math.max(0, balance),
      risk: coverage < 0.8 ? 'high' : coverage < 1.15 ? 'watch' : 'low',
    })
  }

  const baselineInterest = standardInterest(input)
  const reserveRatio = protectedMonths / Math.max(1, schedule.length)
  const payoffRatio = balance <= 0.01 ? 1 : Math.max(0, 1 - balance / input.principal)

  return {
    schedule,
    summary: {
      totalPaid,
      totalInterest,
      interestSaved: Math.max(0, baselineInterest - totalInterest),
      peakPayment,
      lowestCash,
      payoffMonth: balance <= 0.01 ? schedule.length : 0,
      reserveProtectedMonths: protectedMonths,
      policyConfidence: Math.round((reserveRatio * 0.55 + payoffRatio * 0.45) * 100),
      trainingEpisodes: EPISODES,
    },
    methodology: {
      algorithm: 'Tabular Q-learning with seeded Monte Carlo cash-flow scenarios',
      objective: 'Reduce interest and outstanding principal while protecting operating liquidity',
      constraints: [
        'Payment never exceeds principal plus accrued interest',
        'Policy protects at least 90% of the selected cash reserve when feasible',
        'Training scenarios vary revenue ±12% and expenses ±6%',
      ],
    },
  }
}
