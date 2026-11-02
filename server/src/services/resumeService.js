import { createHash } from 'node:crypto'
import { extname, basename } from 'node:path'
import mammoth from 'mammoth'
import { PDFParse } from 'pdf-parse'
import { env } from '../config/env.js'
import { ResumeAnalysis } from '../models/ResumeAnalysis.js'
import { analyzeResume, ATS_PROMPT_VERSION } from './aiService.js'

export const MAX_RESUME_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = new Map([
  ['.pdf', 'application/pdf'],
  ['.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
])
const hash = (value) => createHash('sha256').update(value).digest('hex')
const badFile = (message) => Object.assign(new Error(message), { statusCode: 400 })

export function isSupportedResume(file) {
  return Boolean(file && ALLOWED_TYPES.get(extname(file.originalname || '').toLowerCase()) === file.mimetype)
}

export async function extractResumeText(file) {
  if (!isSupportedResume(file) || !file.buffer?.length || file.buffer.length > MAX_RESUME_SIZE) throw badFile('Upload a non-empty PDF or DOCX up to 5 MB.')
  const extension = extname(file.originalname).toLowerCase()
  if (extension === '.pdf' && file.buffer.subarray(0, 5).toString() !== '%PDF-') throw badFile('The PDF file is invalid.')
  if (extension === '.docx' && file.buffer.subarray(0, 2).toString() !== 'PK') throw badFile('The DOCX file is invalid.')
  let raw
  try {
    if (extension === '.pdf') {
      const parser = new PDFParse({ data: new Uint8Array(file.buffer) })
      try { raw = (await parser.getText()).text } finally { await parser.destroy() }
    } else {
      raw = (await mammoth.extractRawText({ buffer: file.buffer })).value
    }
  } catch {
    throw badFile('Unable to extract text from this document. Please use a text-based PDF or DOCX.')
  }
  const text = String(raw || '').replace(/\s+/g, ' ').trim()
  if (text.length < 50) throw badFile('The resume contains too little extractable text. Scanned images are not supported.')
  return text
}

function safeAnalysis(document, cached = false) {
  return {
    id: document._id.toString(), originalFileName: document.originalFileName,
    mimeType: document.mimeType, fileSize: document.fileSize,
    atsScore: document.atsScore, strengths: document.strengths,
    weaknesses: document.weaknesses, missingSections: document.missingSections,
    keywordFeedback: document.keywordFeedback, formattingFeedback: document.formattingFeedback,
    suggestions: document.suggestions, jobMatchScore: document.jobMatchScore,
    missingKeywords: document.missingKeywords, model: document.model,
    createdAt: document.createdAt, cached,
  }
}

export async function analyzeUploadedResume(studentId, file, rawJobDescription = '') {
  if (!isSupportedResume(file)) throw badFile('Only PDF and DOCX resumes are supported.')
  if (!file.buffer?.length) throw badFile('The resume file is empty.')
  const jobDescription = String(rawJobDescription || '').trim()
  if (jobDescription.length > 5000) throw badFile('Job description must be 5,000 characters or fewer.')
  const contentHash = hash(file.buffer)
  const contextHash = hash(jobDescription)
  const cacheKey = { studentId, contentHash, contextHash, model: env.OPENROUTER_MODEL, promptVersion: ATS_PROMPT_VERSION }
  const cached = await ResumeAnalysis.findOne(cacheKey)
  if (cached) return safeAnalysis(cached, true)

  const text = await extractResumeText(file)
  if (!env.OPENROUTER_API_KEY || !env.OPENROUTER_MODEL) {
    throw Object.assign(new Error('Resume analysis is not configured yet. Please contact the administrator.'), { statusCode: 503 })
  }
  const result = await analyzeResume(text, jobDescription)
  const document = await ResumeAnalysis.create({
    ...cacheKey, originalFileName: basename(file.originalname).slice(0, 255),
    mimeType: file.mimetype, fileSize: file.size,
    ...result,
  })
  return safeAnalysis(document)
}

export async function listResumeAnalyses(studentId) {
  const documents = await ResumeAnalysis.find({ studentId }).sort({ createdAt: -1 }).limit(20)
  return documents.map((document) => safeAnalysis(document))
}
