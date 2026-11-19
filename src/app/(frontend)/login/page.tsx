import type { Metadata } from 'next'
import LoginForm from './login-form'

export const metadata: Metadata = {
  title: 'Log in | CreditDibe',
  description: 'Log in to your CreditDibe business financing account.',
}

export default function LoginPage() {
  return <LoginForm />
}
