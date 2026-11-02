export function notFoundMiddleware(request, _response, next) {
  const error = new Error(`Route not found: ${request.method} ${request.originalUrl}`)
  error.statusCode = 404
  next(error)
}

export function errorMiddleware(error, _request, response, _next) {
  let statusCode = error.statusCode || 500
  let message = error.message || 'An unexpected error occurred'

  if (error.name === 'MulterError') {
    statusCode = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400
    message = error.code === 'LIMIT_FILE_SIZE' ? 'Resume must be 5 MB or smaller.' : 'Invalid resume upload.'
  }

  // Mongoose validation error
  if (error.name === 'CastError') {
    statusCode = 400
    message = 'Invalid resource ID or field value.'
  }
  if (error.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(error.errors || {})
      .map((val) => val.message)
      .join(', ')
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    statusCode = 400
    const field = Object.keys(error.keyValue || {})[0] || 'field'
    message = `Duplicate value for ${field}. Please use another value.`
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token.'
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired.'
  }

  response.status(statusCode).json({
    success: false,
    message: statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : message,
  })
}
