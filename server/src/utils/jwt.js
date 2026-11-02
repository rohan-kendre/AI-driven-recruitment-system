import jwt from 'jsonwebtoken'
import { randomUUID } from 'node:crypto'
import { env } from '../config/env.js'

export function generateAccessToken(user) {
  const userId = user._id ? user._id.toString() : user.id
  return jwt.sign({ id: userId, role: user.role }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  })
}

export function generateRefreshToken(user) {
  const userId = user._id ? user._id.toString() : user.id
  return jwt.sign({ id: userId, role: user.role, jti: randomUUID() }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  })
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET)
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET)
}

export const REFRESH_COOKIE_NAME = 'refreshToken'

export function getCookieOptions() {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  }
}

export function setRefreshTokenCookie(response, token) {
  response.cookie(REFRESH_COOKIE_NAME, token, getCookieOptions())
}

export function clearRefreshTokenCookie(response) {
  const options = getCookieOptions()
  delete options.maxAge
  response.clearCookie(REFRESH_COOKIE_NAME, options)
}
