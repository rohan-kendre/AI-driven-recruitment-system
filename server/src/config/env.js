import 'dotenv/config'

const nodeEnv = process.env.NODE_ENV || 'development'
const production = nodeEnv === 'production'

if (production) {
  for (const key of ['MONGO_URI', 'CLIENT_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET']) {
    if (!process.env[key]?.trim()) throw new Error(`${key} is required in production.`)
  }
  if (!process.env.CLIENT_URL.startsWith('https://')) {
    throw new Error('CLIENT_URL must use HTTPS in production.')
  }
  if (process.env.JWT_ACCESS_SECRET.length < 32 || process.env.JWT_REFRESH_SECRET.length < 32) {
    throw new Error('Production JWT secrets must each contain at least 32 characters.')
  }
  if (process.env.JWT_ACCESS_SECRET === process.env.JWT_REFRESH_SECRET) {
    throw new Error('Access and refresh JWT secrets must differ.')
  }
  if (process.env.COOKIE_SECURE === 'false' || (process.env.COOKIE_SAME_SITE && process.env.COOKIE_SAME_SITE.toLowerCase() !== 'none')) {
    throw new Error('Production refresh cookies require COOKIE_SECURE=true and COOKIE_SAME_SITE=none.')
  }
}

const port = process.env.PORT ? Number(process.env.PORT) : 5000
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be a valid TCP port.')

const cookieSameSite = (process.env.COOKIE_SAME_SITE || (production ? 'none' : 'lax')).toLowerCase()
if (!['lax', 'strict', 'none'].includes(cookieSameSite)) throw new Error('COOKIE_SAME_SITE must be lax, strict, or none.')
const cookieSecure = production || process.env.COOKIE_SECURE === 'true'
if (cookieSameSite === 'none' && !cookieSecure) throw new Error('SameSite=none requires a secure cookie.')

export const env = {
  PORT: port,
  CLIENT_URL: (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/+$/, ''),
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nexhire',
  NODE_ENV: nodeEnv,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'dev_jwt_access_secret_do_not_use_in_prod',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev_jwt_refresh_secret_do_not_use_in_prod',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  COOKIE_SECURE: cookieSecure,
  COOKIE_SAME_SITE: cookieSameSite,
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || '',
}
