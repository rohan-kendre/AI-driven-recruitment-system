import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { after, before, test } from 'node:test'
import mongoose from 'mongoose'
import { app } from '../../src/app.js'
import { env } from '../../src/config/env.js'
import { User } from '../../src/models/User.js'
import { StudentProfile } from '../../src/models/StudentProfile.js'
import { Company } from '../../src/models/Company.js'
import { Job } from '../../src/models/Job.js'
import { Application } from '../../src/models/Application.js'
import { Interview } from '../../src/models/Interview.js'
import { Offer } from '../../src/models/Offer.js'
import { ResumeAnalysis } from '../../src/models/ResumeAnalysis.js'
import { RefreshSession } from '../../src/models/RefreshSession.js'

const uri = process.env.NEXHIRE_TEST_MONGO_URI
if (!uri) throw new Error('Set NEXHIRE_TEST_MONGO_URI to a dedicated nexhire_test database before running integration tests.')
const databaseName = new URL(uri).pathname.replace(/^\//, '')
if (!/^nexhire_test(?:_[a-z0-9]+)?$/i.test(databaseName)) throw new Error('Integration tests require a dedicated nexhire_test database.')

const runId = randomUUID().replaceAll('-', '')
const email = (role) => `nexhire-integration-${runId}-${role}@example.test`
const ids = []
let server
let base
let originalFetch
let databaseVerified = false

before(async () => {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
  if (mongoose.connection.name !== databaseName) {
    await mongoose.disconnect()
    throw new Error('Connected database does not match the dedicated integration test database.')
  }
  databaseVerified = true
  server = app.listen(0, '127.0.0.1')
  await new Promise((resolve) => server.once('listening', resolve))
  base = `http://127.0.0.1:${server.address().port}/api`
  originalFetch = globalThis.fetch
})

after(async () => {
  globalThis.fetch = originalFetch || globalThis.fetch
  env.OPENROUTER_API_KEY = ''
  env.OPENROUTER_MODEL = ''
  try {
    if (databaseVerified && ids.length) {
      const ownedJobs = await Job.find({ recruiterId: { $in: ids } }).select('_id')
      const jobIds = ownedJobs.map((job) => job._id)
      await Promise.all([
        ResumeAnalysis.deleteMany({ studentId: { $in: ids } }),
        RefreshSession.deleteMany({ userId: { $in: ids } }),
        Offer.deleteMany({ $or: [{ studentId: { $in: ids } }, { recruiterId: { $in: ids } }] }),
        Interview.deleteMany({ $or: [{ studentId: { $in: ids } }, { recruiterId: { $in: ids } }] }),
        Application.deleteMany({ $or: [{ studentId: { $in: ids } }, { jobId: { $in: jobIds } }] }),
        StudentProfile.deleteMany({ userId: { $in: ids } }),
        Company.deleteMany({ createdBy: { $in: ids } }),
        Job.deleteMany({ _id: { $in: jobIds } }),
      ])
      await User.deleteMany({ _id: { $in: ids } })
    }
  } finally {
    if (server) await new Promise((resolve) => server.close(resolve))
    await mongoose.disconnect()
  }
})

async function request(path, { method = 'GET', token, cookie, body, form } = {}) {
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (cookie) headers.Cookie = cookie
  if (body) headers['Content-Type'] = 'application/json'
  const response = await originalFetch(`${base}${path}`, { method, headers, body: form || (body ? JSON.stringify(body) : undefined) })
  let data
  try { data = await response.json() } catch { data = null }
  return { status: response.status, data, cookie: response.headers.get('set-cookie')?.split(';')[0] || '' }
}

function testPdf() {
  const content = 'Student resume with React Node Express MongoDB projects internships education and measurable software development results.'
  const stream = `BT /F1 12 Tf 72 700 Td (${content}) Tj ET`
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
  ]
  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  for (const [index, object] of objects.entries()) {
    offsets.push(Buffer.byteLength(pdf))
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  }
  const xref = Buffer.byteLength(pdf)
  pdf += `xref\n0 ${offsets.length}\n0000000000 65535 f \n`
  for (const offset of offsets.slice(1)) pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
  pdf += `trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
  return Buffer.from(pdf)
}

test('authenticated recruitment flow, isolation, workflow guards, and ATS persistence', async (t) => {
  const password = `TestPass-${runId}`
  for (const role of ['admin', 'tpo']) {
    const user = await User.create({ name: `Integration ${role}`, email: email(role), password, role: role.toUpperCase(), status: 'ACTIVE', approvalStatus: 'APPROVED' })
    ids.push(user._id)
  }
  const adminLogin = await request('/auth/login', { method: 'POST', body: { email: email('admin'), password } })
  assert.equal(adminLogin.status, 200)
  const adminToken = adminLogin.data.accessToken
  const tpoToken = (await request('/auth/login', { method: 'POST', body: { email: email('tpo'), password } })).data.accessToken

  for (const role of ['student', 'student2', 'recruiter', 'recruiter2']) {
    const publicRole = role.startsWith('student') ? 'STUDENT' : 'RECRUITER'
    const registered = await request('/auth/register', { method: 'POST', body: { name: `Integration ${role}`, email: email(role), password, role: publicRole } })
    assert.equal(registered.status, 201)
    ids.push(new mongoose.Types.ObjectId(registered.data.user.id))
  }
  await t.test('pending recruiter is blocked and Admin approval is scoped', async () => {
    assert.equal((await request('/auth/login', { method: 'POST', body: { email: email('recruiter'), password } })).status, 403)
    assert.equal((await request(`/admin/users/${ids[0]}/approval`, { method: 'PATCH', token: adminToken, body: { approvalStatus: 'REJECTED' } })).status, 403)
    for (const id of ids.slice(4)) assert.equal((await request(`/admin/users/${id}/approval`, { method: 'PATCH', token: adminToken, body: { approvalStatus: 'APPROVED' } })).status, 200)
  })

  const studentLogin = await request('/auth/login', { method: 'POST', body: { email: email('student'), password } })
  const student2Login = await request('/auth/login', { method: 'POST', body: { email: email('student2'), password } })
  const recruiterLogin = await request('/auth/login', { method: 'POST', body: { email: email('recruiter'), password } })
  const recruiter2Login = await request('/auth/login', { method: 'POST', body: { email: email('recruiter2'), password } })
  const studentToken = studentLogin.data.accessToken
  const student2Token = student2Login.data.accessToken
  const recruiterToken = recruiterLogin.data.accessToken
  const recruiter2Token = recruiter2Login.data.accessToken

  await t.test('refresh rotates and logout revokes a captured cookie', async () => {
    const rotated = await request('/auth/refresh', { method: 'POST', cookie: studentLogin.cookie })
    assert.equal(rotated.status, 200)
    assert.equal((await request('/auth/refresh', { method: 'POST', cookie: studentLogin.cookie })).status, 401)
    assert.equal((await request('/auth/logout', { method: 'POST', cookie: rotated.cookie })).status, 200)
    assert.equal((await request('/auth/refresh', { method: 'POST', cookie: rotated.cookie })).status, 401)
  })
  await t.test('RBAC and profile validation', async () => {
    assert.equal((await request('/jobs', { method: 'POST', token: studentToken, body: {} })).status, 403)
    assert.equal((await request('/admin/users', { token: recruiterToken })).status, 403)
    assert.equal((await request('/students/profile', { method: 'PUT', token: studentToken, body: { branch: 'Computer Engineering', cgpa: 11, graduationYear: 2027 } })).status, 400)
    for (const token of [studentToken, student2Token]) assert.equal((await request('/students/profile', { method: 'PUT', token, body: { branch: 'Computer Engineering', cgpa: 8.5, backlogs: 0, graduationYear: 2027 } })).status, 200)
  })
  const company = await request('/companies/mine', { method: 'PUT', token: recruiterToken, body: { name: `Integration Company ${runId}`, location: 'Pune' } })
  assert.equal(company.status, 200)
  const tomorrow = new Date(Date.now() + 86400000)
  const job = await request('/jobs', { method: 'POST', token: recruiterToken, body: { role: 'Software Engineer', description: 'Build campus recruitment tools.', location: 'Pune', workMode: 'REMOTE', deadline: tomorrow.toISOString(), status: 'OPEN', eligibility: { minCgpa: 7, maxBacklogs: 0, allowedBranches: ['Computer Engineering'], graduationYears: [2027] } } })
  assert.equal(job.status, 201)
  const jobId = job.data.data.id
  await t.test('job ownership, visibility and eligibility', async () => {
    assert.equal((await request(`/jobs/${jobId}`, { token: studentToken })).status, 200)
    assert.equal((await request(`/jobs/${jobId}`, { method: 'PUT', token: recruiter2Token, body: { role: 'Changed' } })).status, 403)
    assert.equal((await request('/jobs', { method: 'GET', token: studentToken })).data.data.some((item) => item.id === jobId), true)
    assert.equal((await request('/applications', { method: 'POST', token: student2Token, body: { jobId: 'invalid' } })).status, 400)
  })
  const application = await request('/applications', { method: 'POST', token: studentToken, body: { jobId } })
  assert.equal(application.status, 201)
  const applicationId = application.data.data.id
  await t.test('ineligible applicant and terminal application are blocked', async () => {
    assert.equal((await request('/students/profile', { method: 'PUT', token: student2Token, body: { cgpa: 5 } })).status, 200)
    assert.equal((await request('/applications', { method: 'POST', token: student2Token, body: { jobId } })).status, 422)
    assert.equal((await request('/students/profile', { method: 'PUT', token: student2Token, body: { cgpa: 8.5 } })).status, 200)
    const second = await request('/applications', { method: 'POST', token: student2Token, body: { jobId } })
    assert.equal(second.status, 201)
    const secondId = second.data.data.id
    assert.equal((await request(`/applications/${secondId}/status`, { method: 'PATCH', token: recruiterToken, body: { status: 'REJECTED' } })).status, 200)
    assert.equal((await request(`/applications/${secondId}/status`, { method: 'PATCH', token: recruiterToken, body: { status: 'SHORTLISTED' } })).status, 400)
    assert.equal((await request('/interviews', { method: 'POST', token: recruiterToken, body: { applicationId: secondId, title: 'Technical Round', date: new Date(Date.now() + 172800000).toISOString(), time: '10:30', mode: 'Virtual', meetingLink: 'https://example.test/meeting' } })).status, 400)
    assert.equal((await request('/offers', { method: 'POST', token: recruiterToken, body: { applicationId: secondId, ctc: '18.5 LPA', joiningDate: '2030-02-01', deadline: '2030-01-01' } })).status, 400)
  })
  await t.test('application duplicate, owner scope, and snapshot', async () => {
    assert.equal((await request('/applications', { method: 'POST', token: studentToken, body: { jobId } })).status, 409)
    assert.equal((await request(`/applications/${applicationId}/status`, { method: 'PATCH', token: recruiter2Token, body: { status: 'SHORTLISTED' } })).status, 403)
    const mine = await request('/applications/my', { token: studentToken })
    assert.equal(mine.data.data[0].eligibilitySnapshot.cgpa, 8.5)
    assert.equal((await request(`/applications/${applicationId}/status`, { method: 'PATCH', token: recruiterToken, body: { status: 'SHORTLISTED' } })).status, 200)
  })
  await t.test('interview validation and persisted scheduling', async () => {
    const payload = { applicationId, title: 'Technical Round', date: new Date(Date.now() + 172800000).toISOString(), time: '10:30', mode: 'Virtual', meetingLink: 'https://example.test/meeting' }
    assert.equal((await request('/interviews', { method: 'POST', token: recruiterToken, body: { ...payload, date: new Date(Date.now() - 86400000).toISOString() } })).status, 400)
    assert.equal((await request('/interviews', { method: 'POST', token: recruiter2Token, body: payload })).status, 403)
    assert.equal((await request('/interviews', { method: 'POST', token: recruiterToken, body: payload })).status, 201)
    assert.equal((await request('/interviews', { method: 'POST', token: recruiterToken, body: payload })).status, 400)
    const studentInterviews = await request('/interviews', { token: studentToken })
    assert.equal(studentInterviews.data.data.length, 1)
    assert.equal(studentInterviews.data.data[0].meetingLink, payload.meetingLink)
  })
  await t.test('offer ownership, decision, and TPO metric', async () => {
    const joining = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
    const deadline = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)
    const payload = { applicationId, ctc: '18.5 LPA', joiningDate: joining, deadline }
    assert.equal((await request('/offers', { method: 'POST', token: recruiter2Token, body: payload })).status, 403)
    assert.equal((await request('/offers', { method: 'POST', token: recruiterToken, body: { ...payload, ctc: '-18.5 LPA' } })).status, 400)
    assert.equal((await request('/offers', { method: 'POST', token: recruiterToken, body: { ...payload, joiningDate: '2030-02-30' } })).status, 400)
    const created = await request('/offers', { method: 'POST', token: recruiterToken, body: payload })
    assert.equal(created.status, 201)
    const offerId = created.data.data.id
    assert.equal((await request(`/offers/${offerId}/status`, { method: 'PATCH', token: student2Token, body: { status: 'ACCEPTED' } })).status, 403)
    assert.equal((await request(`/offers/${offerId}/status`, { method: 'PATCH', token: studentToken, body: { status: 'ACCEPTED' } })).status, 200)
    assert.equal((await request(`/offers/${offerId}/status`, { method: 'PATCH', token: studentToken, body: { status: 'DECLINED' } })).status, 400)
    const stats = await request('/tpo/stats', { token: tpoToken })
    assert.equal(stats.status, 200)
    assert.ok(stats.data.data.placedStudents >= 1)
    assert.equal((await request('/admin/users', { token: adminToken })).status, 200)
  })
  await t.test('ATS upload rejects unsupported file and missing configuration', async () => {
    const unsupported = new FormData()
    unsupported.append('resume', new Blob(['plain text'], { type: 'text/plain' }), 'resume.txt')
    assert.equal((await request('/resumes/ats', { method: 'POST', token: studentToken, form: unsupported })).status, 400)
    const pdf = new FormData()
    pdf.append('resume', new Blob([testPdf()], { type: 'application/pdf' }), 'resume.pdf')
    const originalKey = env.OPENROUTER_API_KEY
    const originalModel = env.OPENROUTER_MODEL
    try {
      env.OPENROUTER_API_KEY = ''
      env.OPENROUTER_MODEL = ''
      assert.equal((await request('/resumes/ats', { method: 'POST', token: studentToken, form: pdf })).status, 503)
    } finally { env.OPENROUTER_API_KEY = originalKey; env.OPENROUTER_MODEL = originalModel }
  })
  await t.test('ATS result persists and identical uploads reuse cached analysis', async () => {
    const originalKey = env.OPENROUTER_API_KEY
    const originalModel = env.OPENROUTER_MODEL
    const originalGlobalFetch = globalThis.fetch
    let providerCalls = 0
    try {
      env.OPENROUTER_API_KEY = 'integration-test-key'
      env.OPENROUTER_MODEL = 'test/mock-model'
      globalThis.fetch = async () => {
        providerCalls += 1
        return { ok: true, status: 200, json: async () => ({ choices: [{ message: { content: JSON.stringify({ atsScore: 82, strengths: ['Relevant projects'], weaknesses: ['Limited metrics'], missingSections: [], keywordFeedback: ['Add role keywords'], formattingFeedback: ['Clear layout'], suggestions: ['Quantify results'] }) } }] }) }
      }
      const upload = async () => {
        const form = new FormData()
        form.append('resume', new Blob([testPdf()], { type: 'application/pdf' }), 'resume.pdf')
        return request('/resumes/ats', { method: 'POST', token: studentToken, form })
      }
      const first = await upload()
      assert.equal(first.status, 200)
      assert.equal(first.data.data.atsScore, 82)
      const second = await upload()
      assert.equal(second.status, 200)
      assert.equal(second.data.data.cached, true)
      assert.equal(providerCalls, 1)
      const history = await request('/resumes/analyses', { token: studentToken })
      assert.equal(history.data.data.length, 1)
    } finally {
      globalThis.fetch = originalGlobalFetch
      env.OPENROUTER_API_KEY = originalKey
      env.OPENROUTER_MODEL = originalModel
    }
  })
})
