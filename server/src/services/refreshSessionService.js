import { createHash } from 'node:crypto'
import { RefreshSession } from '../models/RefreshSession.js'
import { verifyRefreshToken } from '../utils/jwt.js'

const hashToken = (token) => createHash('sha256').update(token).digest('hex')

export async function saveRefreshSession(userId, token) {
  const { exp } = verifyRefreshToken(token)
  return RefreshSession.create({ userId, tokenHash: hashToken(token), expiresAt: new Date(exp * 1000) })
}

export async function consumeRefreshSession(userId, token) {
  return RefreshSession.findOneAndUpdate(
    { userId, tokenHash: hashToken(token), revokedAt: null, expiresAt: { $gt: new Date() } },
    { $set: { revokedAt: new Date() } },
    { new: true },
  )
}

export async function revokeRefreshSession(token) {
  if (!token) return
  await RefreshSession.updateOne(
    { tokenHash: hashToken(token), revokedAt: null },
    { $set: { revokedAt: new Date() } },
  )
}
