import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from '../src/config/db.js'
import { User } from '../src/models/User.js'

const fields = [
  'BOOTSTRAP_ADMIN_NAME', 'BOOTSTRAP_ADMIN_EMAIL', 'BOOTSTRAP_ADMIN_PASSWORD',
  'BOOTSTRAP_TPO_NAME', 'BOOTSTRAP_TPO_EMAIL', 'BOOTSTRAP_TPO_PASSWORD',
]

async function bootstrap() {
  const missing = fields.filter((field) => !process.env[field]?.trim())
  if (missing.length) throw new Error(`Missing bootstrap configuration: ${missing.join(', ')}`)

  const accounts = [
    { role: 'ADMIN', name: process.env.BOOTSTRAP_ADMIN_NAME.trim(), email: process.env.BOOTSTRAP_ADMIN_EMAIL.trim().toLowerCase(), password: process.env.BOOTSTRAP_ADMIN_PASSWORD },
    { role: 'TPO', name: process.env.BOOTSTRAP_TPO_NAME.trim(), email: process.env.BOOTSTRAP_TPO_EMAIL.trim().toLowerCase(), password: process.env.BOOTSTRAP_TPO_PASSWORD },
  ]
  if (accounts.some((account) => account.password.length < 12)) throw new Error('Bootstrap passwords must contain at least 12 characters.')
  if (accounts[0].email === accounts[1].email) throw new Error('Admin and TPO emails must be different.')

  await connectDB()
  const session = await mongoose.startSession()
  try {
    await session.withTransaction(async () => {
      if (await User.exists({ role: { $in: ['ADMIN', 'TPO'] } }).session(session)) {
        throw new Error('A privileged account already exists. Bootstrap refused.')
      }
      if (await User.exists({ email: { $in: accounts.map((account) => account.email) } }).session(session)) {
        throw new Error('A bootstrap email already exists. Bootstrap refused.')
      }
      for (const account of accounts) {
        await new User({ ...account, status: 'ACTIVE', approvalStatus: 'APPROVED' }).save({ session })
      }
    })
    console.log('Created the first ADMIN and TPO accounts. Remove bootstrap variables from the environment now.')
  } finally {
    await session.endSession()
    await mongoose.disconnect()
  }
}

bootstrap().catch((error) => {
  console.error(`Privileged bootstrap failed: ${error.message}`)
  process.exitCode = 1
})
