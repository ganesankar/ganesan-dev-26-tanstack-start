import { createServerFn } from '@tanstack/react-start'
import {
  getRequestHeader,
  setResponseHeader,
} from '@tanstack/react-start/server'
import { adminAuth } from '~/lib/firebase/server'
import {
  verifySessionFromCookieHeader,
  createSessionCookie,
  revokeSession,
  buildSessionCookieHeader,
  buildDeleteCookieHeader,
} from '~/lib/firebase/auth'

export const createSessionFn = createServerFn({ method: 'POST' })
  .inputValidator((d: { idToken: string }) => d)
  .handler(async ({ data }) => {
    const decodedToken = await adminAuth.verifyIdToken(data.idToken)

    if (!decodedToken.admin) {
      throw new Error('User is not an admin')
    }

    const { cookie, maxAge } = await createSessionCookie(data.idToken)
    const headerValue = buildSessionCookieHeader(cookie, maxAge)

    setResponseHeader('Set-Cookie', headerValue)
    return { success: true }
  })

export const signOutFn = createServerFn({ method: 'POST' }).handler(
  async () => {
    const cookieHeader = getRequestHeader('cookie') || ''
    await revokeSession(cookieHeader)

    setResponseHeader('Set-Cookie', buildDeleteCookieHeader())
    return { success: true }
  },
)

export const getUserFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const cookieHeader = getRequestHeader('cookie') || ''
    const user = await verifySessionFromCookieHeader(cookieHeader)

    if (!user) return null

    return {
      uid: user.uid,
      email: user.email,
      admin: user.admin ?? false,
    }
  },
)

export const signUpFn = createServerFn({ method: 'POST' })
  .inputValidator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    const cookieHeader = getRequestHeader('cookie') || ''
    const sessionUser = await verifySessionFromCookieHeader(cookieHeader)
    if (!sessionUser || !sessionUser.admin) {
      throw new Error('Not authenticated or not admin')
    }

    const newUser = await adminAuth.createUser({
      email: data.email,
      password: data.password,
    })

    await adminAuth.setCustomUserClaims(newUser.uid, { admin: true })

    return { uid: newUser.uid, email: newUser.email }
  })
