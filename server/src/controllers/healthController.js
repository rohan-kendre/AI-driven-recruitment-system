import mongoose from 'mongoose'

const readyStateMap = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
}

export function getHealth(_request, response) {
  const readyState = mongoose.connection?.readyState ?? 0
  const dbStatus = readyStateMap[readyState] || 'unknown'
  const isHealthy = dbStatus === 'connected'

  response.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    message: 'NexHire API is running',
    database: {
      status: dbStatus,
    },
  })
}
