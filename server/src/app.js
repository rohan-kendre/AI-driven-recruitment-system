import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'
import { errorMiddleware, notFoundMiddleware } from './middleware/errorMiddleware.js'
import { authRouter } from './routes/authRoutes.js'
import { healthRouter } from './routes/healthRoutes.js'

export const app = express()

app.use(helmet())
app.use(cors({ origin: env.CLIENT_URL, credentials: true }))
app.use(cookieParser())
app.use(express.json({ limit: '100kb' }))

app.use('/api/health', healthRouter)
app.use('/api/auth', authRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)
