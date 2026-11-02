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
}
