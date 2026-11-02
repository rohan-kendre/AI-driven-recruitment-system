import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'
import { errorMiddleware, notFoundMiddleware } from './middleware/errorMiddleware.js'
import { authRouter } from './routes/authRoutes.js'
import { healthRouter } from './routes/healthRoutes.js'
import jobRouter from './routes/jobRoutes.js'
import applicationRouter from './routes/applicationRoutes.js'
import studentRouter from './routes/studentRoutes.js'
import companyRouter from './routes/companyRoutes.js'
import interviewRouter from './routes/interviewRoutes.js'
import offerRouter from './routes/offerRoutes.js'
import tpoRouter from './routes/tpoRoutes.js'
import adminRouter from './routes/adminRoutes.js'
import resumeRouter from './routes/resumeRoutes.js'

export const app = express()

app.use(helmet())
app.use(cors({ origin: env.CLIENT_URL, credentials: true }))
app.use(cookieParser())
app.use(express.json({ limit: '100kb' }))

app.use('/api/health', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/jobs', jobRouter)
app.use('/api/applications', applicationRouter)
app.use('/api/students', studentRouter)
app.use('/api/companies', companyRouter)
app.use('/api/interviews', interviewRouter)
app.use('/api/offers', offerRouter)
app.use('/api/tpo', tpoRouter)
app.use('/api/admin', adminRouter)
app.use('/api/resumes', resumeRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)
