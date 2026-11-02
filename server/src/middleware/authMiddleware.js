import { User } from '../models/User.js'
import { verifyAccessToken } from '../utils/jwt.js'

export async function protect(request, response, next) {
  try {
    let token = null
    const authHeader = request.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]
    }

    if (!token) {
      return response.status(401).json({
        success: false,
        message: 'Authentication required. Please provide a valid Bearer token.',
      })
    }

    let decoded
    try {
      decoded = verifyAccessToken(token)
    } catch (err) {
      const isExpired = err.name === 'TokenExpiredError'
      return response.status(401).json({
        success: false,
        message: isExpired ? 'Access token expired. Please refresh session.' : 'Invalid access token.',
      })
    }

    const user = await User.findById(decoded.id)
    if (!user) {
      return response.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      })
    }

    if (user.status === 'SUSPENDED') {
      return response.status(403).json({
        success: false,
        message: 'Your account is suspended. Please contact platform administration.',
      })
    }

    if (user.status === 'INACTIVE') {
      return response.status(403).json({
        success: false,
        message: 'Your account is currently inactive.',
      })
    }

    if (user.approvalStatus !== 'APPROVED') {
      return response.status(403).json({ success: false, message: 'Your account is not approved.' })
    }

    request.user = user
    next()
  } catch (error) {
    next(error)
  }
}

export function authorizeRoles(...allowedRoles) {
  return (request, response, next) => {
    if (!request.user) {
      return response.status(401).json({
        success: false,
        message: 'Authentication required before checking permissions.',
      })
    }

    if (!allowedRoles.includes(request.user.role)) {
      return response.status(403).json({
        success: false,
        message: `Forbidden: role '${request.user.role}' is not authorized to access this resource.`,
      })
    }

    next()
  }
}
