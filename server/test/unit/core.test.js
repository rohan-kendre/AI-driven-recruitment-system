import assert from 'node:assert/strict'
import test from 'node:test'
import { env } from '../../src/config/env.js'
import { analyzeResume, parseAtsContent, validateAtsResponse } from '../../src/services/aiService.js'
import { evaluateEligibility } from '../../src/services/jobService.js'
import { extractResumeText } from '../../src/services/resumeService.js'
import { saveRefreshSession, consumeRefreshSession } from '../../src/services/refreshSessionService.js'
import { RefreshSession } from '../../src/models/RefreshSession.js'
import { generateRefreshToken, verifyRefreshToken } from '../../src/utils/jwt.js'

const validAnalysis = {
  atsScore: 78, strengths: ['Clear skills'], weaknesses: ['Missing results'],
  missingSections: [], keywordFeedback: ['Add relevant terms'],
  formattingFeedback: ['Readable'], suggestions: ['Quantify impact'],
}

test('refresh tokens are distinct and signed', () => {
  const user = { id: '000000000000000000000001', role: 'STUDENT' }
  const first = generateRefreshToken(user)
  const second = generateRefreshToken(user)
  assert.notEqual(first, second)
  assert.notEqual(verifyRefreshToken(first).jti, verifyRefreshToken(second).jti)
})

test('refresh sessions persist only a hash and atomically consume a matching token', async (t) => {
  const userId = '000000000000000000000001'
  const token = generateRefreshToken({ id: userId, role: 'STUDENT' })
  t.mock.method(RefreshSession, 'create', async (record) => {
    assert.equal(record.userId, userId)
    assert.notEqual(record.tokenHash, token)
    assert.match(record.tokenHash, /^[a-f0-9]{64}$/)
    assert.ok(record.expiresAt > new Date())
    return record
  })
  t.mock.method(RefreshSession, 'findOneAndUpdate', async (query, update) => {
    assert.equal(query.userId, userId)
    assert.notEqual(query.tokenHash, token)
    assert.equal(query.revokedAt, null)
    assert.ok(query.expiresAt.$gt instanceof Date)
    assert.ok(update.$set.revokedAt instanceof Date)
    return { userId }
  })
  await saveRefreshSession(userId, token)
  assert.deepEqual(await consumeRefreshSession(userId, token), { userId })
})

test('eligibility rejects absent profile and blank branch', () => {
  const job = { eligibility: { minCgpa: 7, maxBacklogs: 0, allowedBranches: ['Computer Engineering'], graduationYears: [2027] } }
  assert.equal(evaluateEligibility(job, null).isEligible, false)
  assert.equal(evaluateEligibility(job, { branch: ' ', cgpa: 8, backlogs: 0, graduationYear: 2027 }).isEligible, false)
  assert.equal(evaluateEligibility(job, { branch: 'Computer Engineering', cgpa: 8, backlogs: 0, graduationYear: 2027 }).isEligible, true)
  assert.equal(evaluateEligibility(job, { branch: 'Computer Engineering', cgpa: 6, backlogs: 0, graduationYear: 2027 }).isEligible, false)
})

test('ATS response validator rejects malformed scores and feedback', () => {
  assert.equal(validateAtsResponse(validAnalysis).atsScore, 78)
  assert.throws(() => validateAtsResponse({ ...validAnalysis, atsScore: 101 }))
  assert.throws(() => validateAtsResponse({ ...validAnalysis, strengths: 'good' }))
  assert.throws(() => validateAtsResponse(validAnalysis, true))
  assert.equal(validateAtsResponse({ ...validAnalysis, jobMatchScore: 71, missingKeywords: ['React'] }, true).jobMatchScore, 71)
})

test('ATS parser accepts JSON whitespace and fences but never repairs invalid content', () => {
  assert.equal(parseAtsContent(`  ${JSON.stringify(validAnalysis)}  `).atsScore, 78)
  assert.equal(parseAtsContent('```json\n' + JSON.stringify(validAnalysis) + '\n```').atsScore, 78)
  assert.equal(parseAtsContent(validAnalysis).atsScore, 78)
  assert.deepEqual(parseAtsContent({ ...validAnalysis, strengths: [' ', ' Clear skills '] }).strengths, ['Clear skills'])
  assert.throws(() => parseAtsContent('not JSON'), { statusCode: 502, category: 'invalid_json' })
  assert.throws(() => parseAtsContent({ ...validAnalysis, strengths: 'text' }), { statusCode: 502, category: 'strengths_must_be_array' })
})

test('ATS service returns controlled missing-key error and validates mocked OpenRouter response', async () => {
  const originalKey = env.OPENROUTER_API_KEY
  const originalModel = env.OPENROUTER_MODEL
  try {
    env.OPENROUTER_API_KEY = ''
    env.OPENROUTER_MODEL = 'test/model'
    await assert.rejects(analyzeResume('Valid resume text'), { statusCode: 503 })
    env.OPENROUTER_API_KEY = 'unit-test-key'
    let calls = 0
    const fakeFetch = async (_url, options) => {
      calls += 1
      assert.equal(options.headers.Authorization, 'Bearer unit-test-key')
      assert.equal(JSON.parse(options.body).model, 'test/model')
      assert.equal(JSON.parse(options.body).provider.require_parameters, true)
      assert.equal(JSON.parse(options.body).max_completion_tokens, 3000)
      assert.equal(JSON.parse(options.body).response_format.type, 'json_schema')
      assert.equal(JSON.parse(options.body).response_format.json_schema.strict, true)
      const schema = JSON.parse(options.body).response_format.json_schema.schema
      assert.deepEqual(schema.required, ['atsScore', 'strengths', 'weaknesses', 'missingSections', 'keywordFeedback', 'formattingFeedback', 'suggestions'])
      assert.deepEqual(Object.fromEntries(Object.entries(schema.properties).filter(([, value]) => value.type === 'array').map(([key, value]) => [key, [value.maxItems, value.items.maxLength]])), {
        strengths: [4, 120], weaknesses: [4, 120], missingSections: [4, 100],
        keywordFeedback: [5, 120], formattingFeedback: [4, 120], suggestions: [5, 140],
      })
      return { ok: true, status: 200, json: async () => ({ choices: [{ message: { content: JSON.stringify(validAnalysis) } }] }) }
    }
    assert.equal((await analyzeResume('Valid resume text', '', fakeFetch)).atsScore, 78)
    assert.equal(calls, 1)
    const withJobFetch = async (_url, options) => {
      const schema = JSON.parse(options.body).response_format.json_schema.schema
      assert.deepEqual(schema.required, ['atsScore', 'strengths', 'weaknesses', 'missingSections', 'keywordFeedback', 'formattingFeedback', 'suggestions', 'jobMatchScore', 'missingKeywords'])
      assert.equal(schema.additionalProperties, false)
      assert.equal(schema.properties.missingKeywords.maxItems, 8)
      assert.equal(schema.properties.missingKeywords.items.maxLength, 60)
      return { ok: true, status: 200, json: async () => ({ choices: [{ message: { content: JSON.stringify({ ...validAnalysis, jobMatchScore: 72, missingKeywords: ['Testing'] }) } }] }) }
    }
    assert.equal((await analyzeResume('Valid resume text', 'Job description', withJobFetch)).jobMatchScore, 72)
    await assert.rejects(analyzeResume('Valid resume text', '', async () => ({ ok: true, status: 200, json: async () => ({ choices: [{ message: { content: '{bad' } }] }) })), { statusCode: 502 })
    await assert.rejects(analyzeResume('Valid resume text', '', async () => ({ ok: true, status: 200, json: async () => ({ model: 'test/model', choices: [{ finish_reason: 'length', message: { content: '{incomplete' } }] }) })), { statusCode: 502, category: 'AI_RESPONSE_TRUNCATED' })
  } finally {
    env.OPENROUTER_API_KEY = originalKey
    env.OPENROUTER_MODEL = originalModel
  }
})

test('resume extractor rejects unsupported and malformed files without calling AI', async () => {
  await assert.rejects(extractResumeText({ originalname: 'resume.doc', mimetype: 'application/msword', buffer: Buffer.from('text') }), { statusCode: 400 })
  await assert.rejects(extractResumeText({ originalname: 'resume.pdf', mimetype: 'application/pdf', buffer: Buffer.alloc(0) }), { statusCode: 400 })
  await assert.rejects(extractResumeText({ originalname: 'resume.pdf', mimetype: 'application/pdf', buffer: Buffer.from('not a PDF') }), { statusCode: 400 })
})

test('resume extractor reads text-based PDF and DOCX', async () => {
  const content = 'Test student resume with React Node Express MongoDB projects and internship experience at a university.'
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
  const pdfBuffer = Buffer.from(pdf)
  const pdfText = await extractResumeText({ originalname: 'resume.pdf', mimetype: 'application/pdf', buffer: pdfBuffer })
  assert.match(pdfText, /React Node Express/)

  const docxBase64 = 'UEsDBBQAAAAIAK8NY133S4B1wgAAAHYBAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbH2QuQ7CMAyGX6XKiqgRAwOiLMAKDLyAlbptRC7FLsfbk3INCBjt//gsLw7XSFxcnPVcqU4kzgFYd+SQyxDJZ6UJyaHkMbUQUR+xJZhOJjPQwQt5GcvQoZaLNTXYWyk2l7xmE3ylEllWxephHFiVwhit0ShZh5OvPyjjJ6HMybuHOxN5lA0KvhIG5TfgmdudKCVTU7HHJFt02QXnkGqog+5dTpb/a77cGZrGaHrnh7aYgiZm41tny7fi0PjX/XB/9/IGUEsDBBQAAAAIAK8NY11hey9DiQAAAPIAAAALAAAAX3JlbHMvLnJlbHONzzsOAiEQBuCrEA6ws1pYGKCy2dZ4AQLDIy6PDBj19lJYrMbCcuaffH9GnHHVPZbcQqyNPdKam+Sh93oEaCZg0m0qFfNIXKGk+xjJQ9Xmqj3Cfp4PQFuDK7E12WIlp8XuOLs8K/5jF+eiwVMxt4S5/6j4uhiyJo9d8nshC/a9ngbLQQn4eFG9AFBLAwQUAAAACACvDWNdzFOl2bUAAAD5AAAAEQAAAHdvcmQvZG9jdW1lbnQueG1sRY8xbsMwDEWvQuQAUdChg+F6CNqxGYJcQJEYW0VECiQdObevlA5d3gfxh/c51iFyWDOSwZbvpEP92C1mZXBOw4LZ654LUutuLNlbO2V2lSUW4YCqieZ8d2+Hw7vLPtFuGutw5fjsWTqkw6YLqoHaGrtKUJsTarIFzuiDwYkjwtdWWqPwzTTz5xGa4geDKXiKkMhQSJdUALeCkpACgjfwsFJ6oGiy5350XdYpL5YX/wa5/2enX1BLAQIUABQAAAAIAK8NY133S4B1wgAAAHYBAAATAAAAAAAAAAAAAACAAQAAAABbQ29udGVudF9UeXBlc10ueG1sUEsBAhQAFAAAAAgArw1jXWF7L0OJAAAA8gAAAAsAAAAAAAAAAAAAAIAB8wAAAF9yZWxzLy5yZWxzUEsBAhQAFAAAAAgArw1jXcxTpdm1AAAA+QAAABEAAAAAAAAAAAAAAIABpQEAAHdvcmQvZG9jdW1lbnQueG1sUEsFBgAAAAADAAMAuQAAAIkCAAAAAA=='
  const docxText = await extractResumeText({ originalname: 'resume.docx', mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', buffer: Buffer.from(docxBase64, 'base64') })
  assert.match(docxText, /React Node Express/)
})
