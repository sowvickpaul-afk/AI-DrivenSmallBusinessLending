import type { Metadata } from 'next'
import RepaymentLab from './repayment-lab'

export const metadata: Metadata = {
  title: 'Seasonal Repayment Lab | CreditDibe',
  description:
    'Model a cash-flow-aware loan repayment schedule with CreditDibe’s reinforcement learning policy simulator.',
}

export default function RepaymentLabPage() {
  return <RepaymentLab />
}
