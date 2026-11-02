import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { register, login, refresh, logout, getMe } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

export const authRouter = Router()

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
})

authRouter.post('/register', authLimiter, register)
authRouter.post('/login', authLimiter, login)
authRouter.post('/refresh', authLimiter, refresh)
authRouter.post('/logout', logout)
authRouter.get('/me', protect, getMe)
