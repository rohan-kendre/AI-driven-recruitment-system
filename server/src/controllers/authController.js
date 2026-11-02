import { User } from '../models/User.js'
import { consumeRefreshSession, revokeRefreshSession, saveRefreshSession } from '../services/refreshSessionService.js'
import {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  verifyRefreshToken,
  REFRESH_COOKIE_NAME,
} from '../utils/jwt.js'

export async function register(request, response, next) {
  try {
    const { name, email, password, role = 'STUDENT' } = request.body || {}

    if (!name || !name.trim()) {
      return response.status(400).json({ success: false, message: 'Name is required.' })
    }

    if (!email || !email.trim()) {
      return response.status(400).json({ success: false, message: 'Email is required.' })
    }

    if (!password || password.length < 6) {
      return response.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      })
    }

    const normalizedRole = String(role).toUpperCase().trim()
    const allowedPublicRoles = ['STUDENT', 'RECRUITER']

    if (!allowedPublicRoles.includes(normalizedRole)) {
      return response.status(400).json({
        success: false,
        message: "Public registration is only permitted for 'STUDENT' or 'RECRUITER' roles.",
      })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return response.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      })
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: normalizedRole,
      status: 'ACTIVE',
      approvalStatus: normalizedRole === 'RECRUITER' ? 'PENDING' : 'APPROVED',
    })

    const message =
      normalizedRole === 'RECRUITER'
        ? 'Account registered successfully. Your recruiter profile is pending institutional approval.'
        : 'Account registered successfully. You may now sign in.'

    return response.status(201).json({
      success: true,
      message,
      user: user.toSafeObject(),
    })
  } catch (error) {
    next(error)
  }
}

export async function login(request, response, next) {
  try {
    const { email, password } = request.body || {}

    if (!email || !password) {
      return response.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const user = await User.findOne({ email: normalizedEmail }).select('+password')

    if (!user) {
      return response.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return response.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    if (user.status === 'SUSPENDED') {
      return response.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact platform administration.',
      })
    }

    if (user.status === 'INACTIVE') {
      return response.status(403).json({
        success: false,
        message: 'Your account is inactive.',
      })
    }

    if (user.approvalStatus !== 'APPROVED') {
      return response.status(403).json({
        success: false,
        message: user.approvalStatus === 'PENDING'
          ? 'Your account is pending institutional approval.'
          : 'Your account registration was not approved.',
      })
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)
    await saveRefreshSession(user._id, refreshToken)

    setRefreshTokenCookie(response, refreshToken)

    return response.status(200).json({
      success: true,
      message: 'Signed in successfully.',
      user: user.toSafeObject(),
      accessToken,
    })
  } catch (error) {
    next(error)
  }
}

export async function refresh(request, response, next) {
  try {
    const refreshToken = request.cookies?.[REFRESH_COOKIE_NAME]

    if (!refreshToken) {
      return response.status(401).json({
        success: false,
        message: 'No refresh token available. Please sign in.',
      })
    }

    let decoded
    try {
      decoded = verifyRefreshToken(refreshToken)
    } catch {
      clearRefreshTokenCookie(response)
      return response.status(401).json({
        success: false,
        message: 'Refresh token expired or invalid. Please sign in again.',
      })
    }

    const activeSession = await consumeRefreshSession(decoded.id, refreshToken)
    if (!activeSession) {
      clearRefreshTokenCookie(response)
      return response.status(401).json({ success: false, message: 'Refresh session is no longer active. Please sign in.' })
    }

    const user = await User.findById(decoded.id)
    if (!user || user.status !== 'ACTIVE' || user.approvalStatus !== 'APPROVED') {
      clearRefreshTokenCookie(response)
      return response.status(401).json({
        success: false,
        message: 'User session is no longer active.',
      })
    }

    const newAccessToken = generateAccessToken(user)
    const newRefreshToken = generateRefreshToken(user)
    await saveRefreshSession(user._id, newRefreshToken)
    setRefreshTokenCookie(response, newRefreshToken)

    return response.status(200).json({
      success: true,
      accessToken: newAccessToken,
      user: user.toSafeObject(),
    })
  } catch (error) {
    next(error)
  }
}

export async function logout(request, response, next) {
  try {
    await revokeRefreshSession(request.cookies?.[REFRESH_COOKIE_NAME])
  } catch (error) {
    return next(error)
  }
  clearRefreshTokenCookie(response)
  return response.status(200).json({
    success: true,
    message: 'Signed out successfully.',
  })
}

export function getMe(request, response) {
  return response.status(200).json({
    success: true,
    user: request.user.toSafeObject(),
  })
}
