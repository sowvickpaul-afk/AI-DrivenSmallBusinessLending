import 'server-only'

import { cookies } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'

const SESSION_COOKIE = 'app-session'

export function createAppAuth(appUserCollection: 'users') {
  return {
    async currentUser() {
      const token = (await cookies()).get(SESSION_COOKIE)?.value
      if (!token) return null

      const payload = await getPayloadClient()
      const authHeaders = new Headers({ Authorization: `JWT ${token}` })
      const { user } = await payload.auth({ headers: authHeaders })

      if (!user || user.collection !== appUserCollection) return null
      return user
    },

    async login(email: string, password: string) {
      const payload = await getPayloadClient()
      const result = await payload.login({
        collection: appUserCollection,
        data: { email, password },
        overrideAccess: false,
      })

      if (!result.token || !result.user) throw new Error('Unable to create a session.')

      const cookieStore = await cookies()
      cookieStore.set(SESSION_COOKIE, result.token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 2,
      })

      return result.user
    },

    async logout() {
      const cookieStore = await cookies()
      cookieStore.delete(SESSION_COOKIE)
    },
  }
}

export const appAuth = createAppAuth('users')
