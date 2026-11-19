import type { Metadata } from 'next'
import ApplyForm from './apply-form'

export const metadata: Metadata = {
  title: 'Apply for business financing | CreditDibe',
  description:
    'Create your CreditDibe account and start an application for flexible business financing.',
}

export default function ApplyPage() {
  const now = new Date()
  const maxEstablishedMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`

  return <ApplyForm maxEstablishedMonth={maxEstablishedMonth} />
}
