import http from 'http'
import { app } from './app.js'
import { connectDB } from './config/db.js'
import { env } from './config/env.js'

async function startServer() {
  try {
    await connectDB()
    const host = env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1'
    const server4 = http.createServer(app)
    server4.listen(env.PORT, host, () => {
      console.log(`NexHire API running on ${host}:${env.PORT} (${env.NODE_ENV})`)
    })
    server4.on('error', (err) => {
      console.error('Fatal server error:', err.message)
      process.exit(1)
    })

    if (env.NODE_ENV !== 'production') {
      const server6 = http.createServer(app)
      server6.listen(env.PORT, '::1', () => {
        // IPv6 localhost binding active for local development
      })
      server6.on('error', () => {
        // Ignore if IPv6 loopback is restricted or unavailable
      })
    }
  } catch (error) {
    console.error('Fatal: Could not connect to database. Server shutting down.', error.message)
    process.exit(1)
  }
}

startServer()
