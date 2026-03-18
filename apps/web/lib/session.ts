const SESSION_KEY = 'quibes-session'
const SEVEN_DAYS_SECONDS = 7 * 24 * 60 * 60

export function setSessionCookie(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${SESSION_KEY}=1; path=/; SameSite=Lax; Max-Age=${SEVEN_DAYS_SECONDS}`
}

export function clearSessionCookie(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${SESSION_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`
}
