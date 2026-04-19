import { adminAuth } from './server'

const SESSION_COOKIE_NAME = '__session'
const SESSION_COOKIE_MAX_AGE = parseInt(
  process.env.SESSION_COOKIE_MAX_AGE || '1209600000',
  10
)

export function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {}
  for (const pair of cookieHeader.split(';')) {
    const [key, ...rest] = pair.split('=')
    if (key) cookies[key.trim()] = rest.join('=').trim()
  }
  return cookies
}

export async function createSessionCookie(idToken: string): Promise<{ cookie: string; maxAge: number }> {
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_COOKIE_MAX_AGE,
  })

  return {
    cookie: sessionCookie,
    maxAge: SESSION_COOKIE_MAX_AGE / 1000,
  }
}

export async function verifySessionFromCookieHeader(cookieHeader: string) {
  const cookies = parseCookies(cookieHeader)
  const sessionCookie = cookies[SESSION_COOKIE_NAME]

  if (!sessionCookie) return null

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true)
    return decodedClaims
  } catch {
    return null
  }
}

export async function revokeSession(cookieHeader: string) {
  const cookies = parseCookies(cookieHeader)
  const sessionCookie = cookies[SESSION_COOKIE_NAME]
  if (sessionCookie) {
    try {
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie)
      await adminAuth.revokeRefreshTokens(decodedClaims.sub)
    } catch {
      // ignore
    }
  }
}

export function hasSessionCookie(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false
  return cookieHeader.includes(`${SESSION_COOKIE_NAME}=`)
}

export function buildSessionCookieHeader(sessionCookie: string, maxAge: number): string {
  const secure = process.env.NODE_ENV === 'production'
  const sameSite = secure ? 'None' : 'Lax'
  return `${SESSION_COOKIE_NAME}=${sessionCookie}; Max-Age=${maxAge}; Path=/; HttpOnly; ${secure ? 'Secure; ' : ''}SameSite=${sameSite}`
}

export function buildDeleteCookieHeader(): string {
  const secure = process.env.NODE_ENV === 'production'
  const sameSite = secure ? 'None' : 'Lax'
  return `${SESSION_COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; ${secure ? 'Secure; ' : ''}SameSite=${sameSite}`
}
