import 'dotenv/config'

const port = Number(process.env.PORT) || 5000
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nexhire'
const nodeEnv = process.env.NODE_ENV || 'development'

export const env = {
  PORT: port,
  CLIENT_URL: clientUrl,
  MONGO_URI: mongoUri,
  NODE_ENV: nodeEnv,
  port,
  clientUrl,
  mongoUri,
  nodeEnv,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'dev_jwt_access_secret_do_not_use_in_prod',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev_jwt_refresh_secret_do_not_use_in_prod',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  COOKIE_SECURE: process.env.COOKIE_SECURE === 'true' || nodeEnv === 'production',
  COOKIE_SAME_SITE: process.env.COOKIE_SAME_SITE || (nodeEnv === 'production' ? 'none' : 'lax'),
}
