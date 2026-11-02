import mongoose from 'mongoose'
import { env } from './env.js'

let isListenersRegistered = false

function registerConnectionEvents() {
  if (isListenersRegistered) return
  isListenersRegistered = true

  mongoose.connection.on('connected', () => {
    console.log('[MongoDB] Connection event: connected')
  })

  mongoose.connection.on('error', (err) => {
    console.error('[MongoDB] Connection event error:', err.message)
  })

  mongoose.connection.on('disconnected', () => {
    console.log('[MongoDB] Connection event: disconnected')
  })
}

export async function connectDB() {
  registerConnectionEvents()

  try {
    const conn = await mongoose.connect(env.MONGO_URI)
    console.log(
      `[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`
    )
    return conn
  } catch (error) {
    console.error(`[MongoDB] Initial connection error: ${error.message}`)
    throw error
  }
}
