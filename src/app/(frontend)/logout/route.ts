import { appAuth } from '@/lib/app-auth'

export async function POST() {
  await appAuth.logout()
  return new Response(null, { status: 303, headers: { location: '/' } })
}
