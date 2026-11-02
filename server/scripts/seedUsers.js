import mongoose from 'mongoose'
import { connectDB } from '../src/config/db.js'
import { User } from '../src/models/User.js'

export const DEMO_USERS = [
  {
    name: 'Aarav Kulkarni',
    email: 'student@nexhire.demo',
    password: 'Password123!',
    role: 'STUDENT',
    status: 'ACTIVE',
    approvalStatus: 'APPROVED',
  },
  {
    name: 'Vikram Malhotra',
    email: 'recruiter@nexhire.demo',
    password: 'Password123!',
    role: 'RECRUITER',
    status: 'ACTIVE',
    approvalStatus: 'APPROVED',
  },
  {
    name: 'Pending Recruiter',
    email: 'pending.recruiter@nexhire.demo',
    password: 'Password123!',
    role: 'RECRUITER',
    status: 'ACTIVE',
    approvalStatus: 'PENDING',
  },
  {
    name: 'Prof. K. R. Sharma',
    email: 'tpo@nexhire.demo',
    password: 'Password123!',
    role: 'TPO',
    status: 'ACTIVE',
    approvalStatus: 'APPROVED',
  },
  {
    name: 'Aditi Sen',
    email: 'admin@nexhire.demo',
    password: 'Password123!',
    role: 'ADMIN',
    status: 'ACTIVE',
    approvalStatus: 'APPROVED',
  },
]

async function seedUsers() {
  console.log('Seeding demo users...')
  await connectDB()

  let createdCount = 0
  let existingCount = 0

  for (const demoUser of DEMO_USERS) {
    const existing = await User.findOne({ email: demoUser.email })
    if (!existing) {
      await User.create(demoUser)
      console.log(`[SEED] Created user: ${demoUser.name} (${demoUser.email}) [${demoUser.role}]`)
      createdCount++
    } else {
      console.log(`[SEED] User already exists: ${demoUser.email} (Skipping)`)
      existingCount++
    }
  }

  console.log(`[SEED] Completed. Created: ${createdCount}, Existing: ${existingCount}`)
  await mongoose.disconnect()
}

seedUsers()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed error:', err)
    process.exit(1)
  })
